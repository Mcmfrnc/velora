# VELORA - English Learning Web App

Learn Naturally. Speak Confidently.

Velora is a language learning platform that helps learners improve their English through movies, conversations, stories, podcasts, and other real-world content.

## Features

- Real-time conversation practice
- Movie-based learning experiences
- Speech recognition feedback
- Pronunciation improvement
- Interactive learning sessions

## Technology Stack

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Backend**: Node.js, Express.js
- **Real-time Communication**: Socket.IO
- **Speech Recognition**: Web Speech API
- **UI Framework**: Custom CSS with modern design principles

## Quick Start

### Prerequisites

- Node.js (v14 or higher)
- Modern web browser with microphone access
- Internet connection for real-time features

### Installation

1. Clone or download the project files
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Usage

1. **Choose Your Character**: Select either Peter Griffin or Stewie Griffin
2. **Wait for Partner**: The app will connect you with another learner
3. **Practice Dialogs**: Take turns reading your character's lines
4. **Get Feedback**: Receive real-time feedback on your pronunciation
5. **Complete Session**: Review your accuracy and progress

## How It Works

### Speech Recognition
- Uses the Web Speech API for real-time speech recognition
- Compares your speech with the expected dialog text
- Provides accuracy feedback with visual indicators
- Highlights incorrect pronunciations in red

### Peer-to-Peer Connection
- Socket.IO manages real-time connections between users
- Automatic partner matching based on character selection
- Synchronized dialog progression between peers
- Real-time status updates and feedback sharing

### Dialog System
- Pre-loaded Family Guy scene dialogs
- Character-specific line assignments
- Progressive difficulty and varied vocabulary
- Contextual conversation practice

## Browser Compatibility

- **Chrome**: Full support (recommended)
- **Firefox**: Full support
- **Safari**: Full support (iOS 14.5+)
- **Edge**: Full support

**Note**: Microphone access is required for speech recognition features.

## File Structure

```
Velora/
├── index.html          # Main application HTML
├── styles.css          # Application styling
├── app.js             # Frontend JavaScript logic
├── server.js          # Backend server and Socket.IO
├── package.json       # Node.js dependencies
└── README.md          # This file
```

## Features in Detail

### Character Selection
- Choose between Peter Griffin and Stewie Griffin
- Each character has unique dialog lines and personality
- Visual character cards with hover effects

### Speech Recognition Engine
- Real-time speech-to-text conversion
- Intelligent text similarity matching
- Configurable accuracy thresholds
- Error handling and retry mechanisms

### Visual Feedback System
- Green highlights for correct speech
- Red highlights for incorrect or unclear speech
- Animated progress bars and status indicators
- Responsive design for all screen sizes

### Session Management
- Track accuracy percentages
- Monitor completed dialogs
- Session timing and statistics
- Results summary with performance metrics

## Development

### Adding New Scenes
To add new movie scenes and dialogs:

1. Edit the `dialogData` array in `app.js`
2. Add character information to the `characters` object
3. Update character selection UI in `index.html`

### Customizing Speech Recognition
Adjust recognition sensitivity in `app.js`:
- `similarity > 0.7` for strict matching
- `similarity > 0.4` for partial matching
- Modify `calculateSimilarity()` function for different algorithms

### Styling Customization
- Edit `styles.css` for visual changes
- Modify CSS custom properties for color schemes
- Responsive breakpoints are defined for mobile optimization

## Troubleshooting

### Microphone Access Issues
- Ensure browser permissions allow microphone access
- Check system microphone settings
- Try refreshing the page and re-granting permissions

### Connection Problems
- Verify internet connection
- Check if port 3000 is available
- Restart the server if needed

### Speech Recognition Not Working
- Ensure you're using a supported browser
- Check microphone hardware
- Speak clearly and at normal volume
- Try different browsers if issues persist

## Future Enhancements

- Multiple language support
- Custom dialog upload functionality
- Video chat integration
- Advanced pronunciation analysis
- Gamification features (points, achievements)
- Mobile app versions
- Teacher dashboard for classroom use

## License

MIT License - Feel free to use and modify for educational purposes.

## Support

For issues or questions, please check the troubleshooting section or create an issue in the project repository.

---

**Happy Learning with Velora!** 🎭🗣️


