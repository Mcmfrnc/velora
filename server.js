const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    },
    // Enhanced connection settings for stability
    pingTimeout: 60000,
    pingInterval: 25000,
    upgradeTimeout: 10000,
    allowEIO3: true,
    transports: ['websocket', 'polling']
});

const PORT = process.env.PORT || 3000;

// Serve static files
app.use(express.static(path.join(__dirname)));

// Route for the main page
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Store active rooms and users
const rooms = new Map();
const users = new Map();

io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Enhanced connection management
    socket.connectionRetries = 0;
    socket.maxRetries = 3;
    socket.lastPing = Date.now();
    
    // Handle ping/pong for connection stability
    socket.on('ping', () => {
        socket.lastPing = Date.now();
        socket.emit('pong');
    });
    
    // Handle connection errors
    socket.on('error', (error) => {
        console.error(`Socket error for ${socket.id}:`, error);
    });
    
    // Handle user joining a room
    socket.on('join-room', (data) => {
        const { roomId, character, userName } = data;
        
        // Leave any previous room
        if (users.has(socket.id)) {
            const prevRoom = users.get(socket.id).roomId;
            socket.leave(prevRoom);
            if (rooms.has(prevRoom)) {
                const room = rooms.get(prevRoom);
                room.users = room.users.filter(user => user.id !== socket.id);
                if (room.users.length === 0) {
                    rooms.delete(prevRoom);
                } else {
                    // Notify remaining users
                    socket.to(prevRoom).emit('user-left', { userId: socket.id });
                }
            }
        }

        // Join new room
        socket.join(roomId);
        
        // Initialize room if it doesn't exist
        if (!rooms.has(roomId)) {
            rooms.set(roomId, {
                id: roomId,
                users: [],
                currentDialog: 0,
                dialogData: [
                    { speaker: 'peter', text: "Hey Lois, remember that time when I fought that giant chicken?" },
                    { speaker: 'stewie', text: "Oh please, that's nothing compared to my plans for world domination." },
                    { speaker: 'peter', text: "Stewie, you're just a baby. What do you know about fighting?" },
                    { speaker: 'stewie', text: "More than you'd think, fat man. I've studied seventeen different martial arts." },
                    { speaker: 'peter', text: "Well, I once ate a whole turkey in one sitting!" },
                    { speaker: 'stewie', text: "That's disgusting, not impressive. Your lack of self-control is appalling." },
                    { speaker: 'peter', text: "Hey, at least I don't talk like I'm from England!" },
                    { speaker: 'stewie', text: "It's called having proper diction, you uncultured swine." },
                    { speaker: 'peter', text: "Whatever, Stewie. Want to go get some ice cream?" },
                    { speaker: 'stewie', text: "Fine, but I'm choosing the flavor this time." }
                ]
            });
        }

        const room = rooms.get(roomId);
        const user = {
            id: socket.id,
            character,
            userName: userName || `User_${socket.id.substring(0, 6)}`
        };

        // Check if character is already taken
        const existingUser = room.users.find(u => u.character === character);
        if (existingUser && room.users.length < 2) {
            socket.emit('character-taken', { character });
            return;
        }

        room.users.push(user);
        users.set(socket.id, { roomId, character, userName: user.userName });

        // Notify user of successful join
        socket.emit('room-joined', {
            roomId,
            character,
            users: room.users,
            currentDialog: room.currentDialog,
            dialogData: room.dialogData
        });

        // Notify other users in the room
        socket.to(roomId).emit('user-joined', user);

        // If room is full (2 users), start the session
        if (room.users.length === 2) {
            io.to(roomId).emit('session-ready', {
                users: room.users,
                currentDialog: room.currentDialog
            });
        }

        console.log(`User ${socket.id} joined room ${roomId} as ${character}`);
    });

    // Handle dialog completion
    socket.on('dialog-completed', (data) => {
        const user = users.get(socket.id);
        if (!user) return;

        const room = rooms.get(user.roomId);
        if (!room) return;

        const { accuracy, transcript } = data;
        
        // Broadcast to other users in the room
        socket.to(user.roomId).emit('partner-dialog-completed', {
            userId: socket.id,
            character: user.character,
            accuracy,
            transcript
        });

        console.log(`User ${socket.id} completed dialog with ${accuracy}% accuracy`);
    });

    // Handle next dialog request
    socket.on('next-dialog', () => {
        const user = users.get(socket.id);
        if (!user) return;

        const room = rooms.get(user.roomId);
        if (!room) return;

        room.currentDialog++;
        
        // Broadcast new dialog to all users in the room
        io.to(user.roomId).emit('dialog-updated', {
            currentDialog: room.currentDialog,
            dialogData: room.dialogData
        });
    });

    // Handle speech recognition results
    socket.on('speech-result', (data) => {
        const user = users.get(socket.id);
        if (!user) return;

        // Broadcast to other users in the room for real-time feedback
        socket.to(user.roomId).emit('partner-speech', {
            userId: socket.id,
            character: user.character,
            transcript: data.transcript,
            isRecording: data.isRecording
        });
    });

    // Handle mic status updates
    socket.on('mic-status', (data) => {
        const user = users.get(socket.id);
        if (!user) return;

        socket.to(user.roomId).emit('partner-mic-status', {
            userId: socket.id,
            isActive: data.isActive
        });
    });

    // Handle disconnect with enhanced cleanup
    socket.on('disconnect', (reason) => {
        console.log(`User disconnected: ${socket.id}, reason: ${reason}`);
        
        if (users.has(socket.id)) {
            const user = users.get(socket.id);
            const room = rooms.get(user.roomId);
            
            if (room) {
                // Remove user from room
                room.users = room.users.filter(u => u.id !== socket.id);
                
                // Notify other users with enhanced information
                socket.to(user.roomId).emit('user-left', { 
                    userId: socket.id,
                    reason: reason,
                    timestamp: Date.now()
                });
                
                // Clean up empty rooms
                if (room.users.length === 0) {
                    rooms.delete(user.roomId);
                    console.log(`Room ${user.roomId} deleted - no users remaining`);
                } else {
                    console.log(`Room ${user.roomId} has ${room.users.length} users remaining`);
                }
            }
            
            users.delete(socket.id);
        }
        
        // Clean up any intervals or timers
        if (socket.keepAliveInterval) {
            clearInterval(socket.keepAliveInterval);
        }
    });
});

// API endpoints for room management
app.get('/api/rooms', (req, res) => {
    const roomList = Array.from(rooms.values()).map(room => ({
        id: room.id,
        userCount: room.users.length,
        users: room.users.map(user => ({
            character: user.character,
            userName: user.userName
        }))
    }));
    res.json(roomList);
});

app.get('/api/room/:id', (req, res) => {
    const roomId = req.params.id;
    const room = rooms.get(roomId);
    
    if (!room) {
        return res.status(404).json({ error: 'Room not found' });
    }
    
    res.json({
        id: room.id,
        userCount: room.users.length,
        users: room.users.map(user => ({
            character: user.character,
            userName: user.userName
        })),
        currentDialog: room.currentDialog
    });
});

server.listen(PORT, () => {
    console.log(`Velora server running on port ${PORT}`);
    console.log(`Open http://localhost:${PORT} in your browser`);
});

module.exports = { app, server, io };


