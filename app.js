class PeerlyApp {
    constructor() {
        this.peer = null;
        this.conn = null;
        this.recognition = null;
        this.isRecording = false;
        this.currentCharacter = null;
        this.partnerCharacter = null;
        this.currentDialogIndex = 0;
        this.sessionStartTime = null;
        this.correctDialogs = 0;
        this.totalDialogs = 0;
        
        // Movie database with different scenes and multiple characters
        this.movieDatabase = {
            'family-guy': {
                title: 'Family Guy - Griffin House',
                characters: {
                    peter: { name: 'Peter Griffin', avatar: 'https://via.placeholder.com/120x120/4CAF50/white?text=Peter', personality: 'childish, loud, impulsive' },
                    lois: { name: 'Lois Griffin', avatar: 'https://via.placeholder.com/120x120/E91E63/white?text=Lois', personality: 'patient, responsible, sometimes sarcastic' },
                    stewie: { name: 'Stewie Griffin', avatar: 'https://via.placeholder.com/120x120/2196F3/white?text=Stewie', personality: 'sophisticated, evil genius, British accent' },
                    brian: { name: 'Brian Griffin', avatar: 'https://via.placeholder.com/120x120/795548/white?text=Brian', personality: 'intellectual, witty, sometimes pretentious' },
                    meg: { name: 'Meg Griffin', avatar: 'https://via.placeholder.com/120x120/9C27B0/white?text=Meg', personality: 'insecure, awkward, seeking acceptance' },
                    chris: { name: 'Chris Griffin', avatar: 'https://via.placeholder.com/120x120/FF9800/white?text=Chris', personality: 'naive, innocent, artistic' }
                },
                scenes: {
                    'peter-stewie': [
                        { speaker: 'peter', text: "Hey Stewie, want to help daddy with his latest get-rich-quick scheme?" },
                        { speaker: 'stewie', text: "Oh please, your schemes are more pathetic than your attempts at parenting." },
                        { speaker: 'peter', text: "Come on, this one's different! We're gonna sell... uh... what were we selling again?" },
                        { speaker: 'stewie', text: "And this is exactly why your ventures fail, you simpleton." },
                        { speaker: 'peter', text: "Hey, at least I don't spend my time plotting world domination from a crib!" },
                        { speaker: 'stewie', text: "At least my plans are well-thought-out and achievable." },
                        { speaker: 'peter', text: "Achievable? You can't even reach the cookie jar!" },
                        { speaker: 'stewie', text: "That's what minions are for, fat man." }
                    ],
                    'lois-brian': [
                        { speaker: 'lois', text: "Brian, I'm worried about Peter's latest obsession with that new hobby." },
                        { speaker: 'brian', text: "Let me guess, he's discovered something that requires absolutely no skill or intelligence?" },
                        { speaker: 'lois', text: "He's trying to become a professional food critic after watching one episode of Top Chef." },
                        { speaker: 'brian', text: "Well, at least he has experience eating. That's more qualification than usual." },
                        { speaker: 'lois', text: "He gave the kitchen sink a two-star review because it 'lacked seasoning.'" },
                        { speaker: 'brian', text: "I have to admit, that's actually pretty clever for Peter." },
                        { speaker: 'lois', text: "He was trying to drink from it, Brian." },
                        { speaker: 'brian', text: "Ah, there's the Peter we know and barely tolerate." }
                    ]
                }
            },
            'the-office': {
                title: 'The Office - Scranton Branch',
                characters: {
                    jim: { name: 'Jim Halpert', avatar: 'https://via.placeholder.com/120x120/2196F3/white?text=Jim', personality: 'prankster, laid-back, sarcastic' },
                    dwight: { name: 'Dwight Schrute', avatar: 'https://via.placeholder.com/120x120/FF5722/white?text=Dwight', personality: 'intense, loyal, eccentric' },
                    michael: { name: 'Michael Scott', avatar: 'https://via.placeholder.com/120x120/4CAF50/white?text=Michael', personality: 'well-meaning, inappropriate, attention-seeking' },
                    pam: { name: 'Pam Beesly', avatar: 'https://via.placeholder.com/120x120/E91E63/white?text=Pam', personality: 'sweet, artistic, quietly strong' },
                    angela: { name: 'Angela Martin', avatar: 'https://via.placeholder.com/120x120/9C27B0/white?text=Angela', personality: 'strict, judgmental, cat-lover' },
                    kevin: { name: 'Kevin Malone', avatar: 'https://via.placeholder.com/120x120/795548/white?text=Kevin', personality: 'simple, food-obsessed, surprisingly deep' }
                },
                scenes: {
                    'jim-dwight': [
                        { speaker: 'jim', text: "Hey Dwight, I think your computer might be running a little slow today." },
                        { speaker: 'dwight', text: "Impossible. I have the most advanced security protocols in the office." },
                        { speaker: 'jim', text: "Really? Because I think someone might have put your stapler in Jell-O again." },
                        { speaker: 'dwight', text: "What?! Jim! This is the third time this month!" },
                        { speaker: 'jim', text: "I have no idea what you're talking about. Maybe it's a Jell-O ghost." },
                        { speaker: 'dwight', text: "There's no such thing as Jell-O ghosts, Jim. This is clearly sabotage!" },
                        { speaker: 'jim', text: "You should probably report this to corporate. It sounds very serious." },
                        { speaker: 'dwight', text: "I will! And when I find out who did this, there will be consequences!" }
                    ],
                    'michael-angela': [
                        { speaker: 'michael', text: "Angela, I need you to plan the office party, but make it fun this time." },
                        { speaker: 'angela', text: "My parties are perfectly appropriate for a professional workplace." },
                        { speaker: 'michael', text: "Come on, last time you served plain crackers and water." },
                        { speaker: 'angela', text: "It was sparkling water, and those crackers were whole grain." },
                        { speaker: 'michael', text: "See, this is why people don't come to your parties." },
                        { speaker: 'angela', text: "Quality people appreciate quality refreshments." },
                        { speaker: 'michael', text: "Angela, we need music, dancing, maybe some fun games!" },
                        { speaker: 'angela', text: "Fine, but I'm not responsible for any inappropriate behavior." }
                    ],
                    'pam-kevin': [
                        { speaker: 'pam', text: "Kevin, did you finish those expense reports I gave you?" },
                        { speaker: 'kevin', text: "Oh yeah, I did them. But I got hungry and might have spilled some chili on them." },
                        { speaker: 'pam', text: "Kevin, these are important financial documents." },
                        { speaker: 'kevin', text: "Don't worry, the chili was really good. Five-bean recipe." },
                        { speaker: 'pam', text: "That's... not really the point I was making." },
                        { speaker: 'kevin', text: "Oh, you want the recipe? I can write it down for you." },
                        { speaker: 'pam', text: "Maybe later, Kevin. Let's focus on getting clean copies of these reports." },
                        { speaker: 'kevin', text: "Okay, but seriously, this chili could change your life." }
                    ]
                }
            },
            'friends': {
                title: 'Friends - Central Perk & Apartments',
                characters: {
                    ross: { name: 'Ross Geller', avatar: 'https://via.placeholder.com/120x120/FF9800/white?text=Ross', personality: 'nerdy, paleontologist, dramatic' },
                    rachel: { name: 'Rachel Green', avatar: 'https://via.placeholder.com/120x120/E91E63/white?text=Rachel', personality: 'fashionable, spoiled-turned-independent, emotional' },
                    monica: { name: 'Monica Geller', avatar: 'https://via.placeholder.com/120x120/2196F3/white?text=Monica', personality: 'competitive, clean-freak, chef' },
                    chandler: { name: 'Chandler Bing', avatar: 'https://via.placeholder.com/120x120/9C27B0/white?text=Chandler', personality: 'sarcastic, statistical analyst, commitment-phobic' },
                    joey: { name: 'Joey Tribbiani', avatar: 'https://via.placeholder.com/120x120/4CAF50/white?text=Joey', personality: 'simple, actor, food-loving' },
                    phoebe: { name: 'Phoebe Buffay', avatar: 'https://via.placeholder.com/120x120/FF5722/white?text=Phoebe', personality: 'quirky, musician, free-spirited' }
                },
                scenes: {
                    'ross-rachel': [
                        { speaker: 'ross', text: "So Rachel, how's the new job at Bloomingdale's going?" },
                        { speaker: 'rachel', text: "It's amazing! I never thought I'd love fashion this much." },
                        { speaker: 'ross', text: "That's great. I remember when you used to hate shopping." },
                        { speaker: 'rachel', text: "That was the old Rachel. The new Rachel lives for this stuff!" },
                        { speaker: 'ross', text: "Well, I'm happy for you. Even if I don't understand fashion." },
                        { speaker: 'rachel', text: "Ross, you wear the same sweater vest every week. Of course you don't get it." },
                        { speaker: 'ross', text: "We were on a break from fashion advice!" },
                        { speaker: 'rachel', text: "Did you just make a 'we were on a break' joke about fashion?" }
                    ],
                    'monica-chandler': [
                        { speaker: 'monica', text: "Chandler, could you BE any messier? Look at this apartment!" },
                        { speaker: 'chandler', text: "Could you BE any more obsessed with cleaning? It's just a few dishes." },
                        { speaker: 'monica', text: "A few dishes? There's a science experiment growing in that coffee mug!" },
                        { speaker: 'chandler', text: "I prefer to think of it as... abstract art." },
                        { speaker: 'monica', text: "That's it! We're implementing a cleaning schedule." },
                        { speaker: 'chandler', text: "Oh no, not the dreaded cleaning schedule! Could I BE in any more trouble?" },
                        { speaker: 'monica', text: "Stop making jokes and start making this place livable!" },
                        { speaker: 'chandler', text: "Fine, but I'm not scrubbing anything that moves on its own." }
                    ],
                    'joey-phoebe': [
                        { speaker: 'joey', text: "Phoebe, I don't understand your new song. What's it about?" },
                        { speaker: 'phoebe', text: "It's about a cat who dreams of being a tiger but settles for being a really confident house cat." },
                        { speaker: 'joey', text: "Okay... and the part about the smelly cheese?" },
                        { speaker: 'phoebe', text: "That's a metaphor for life's disappointments, Joey." },
                        { speaker: 'joey', text: "Right, right. And when you meow for thirty seconds straight?" },
                        { speaker: 'phoebe', text: "That's the cat expressing its inner turmoil through primal vocalization." },
                        { speaker: 'joey', text: "This is why I stick to acting. At least then someone else writes the weird stuff." },
                        { speaker: 'phoebe', text: "Your loss, Joey. This song is going to change the world." }
                    ]
                }
            },
            'sherlock': {
                title: 'Sherlock - Baker Street & Crime Scenes',
                characters: {
                    sherlock: { name: 'Sherlock Holmes', avatar: 'https://via.placeholder.com/120x120/9C27B0/white?text=Sherlock', personality: 'brilliant, arrogant, observant' },
                    watson: { name: 'Dr. Watson', avatar: 'https://via.placeholder.com/120x120/607D8B/white?text=Watson', personality: 'loyal, practical, military doctor' },
                    moriarty: { name: 'James Moriarty', avatar: 'https://via.placeholder.com/120x120/F44336/white?text=Moriarty', personality: 'genius, criminal mastermind, theatrical' },
                    mycroft: { name: 'Mycroft Holmes', avatar: 'https://via.placeholder.com/120x120/795548/white?text=Mycroft', personality: 'bureaucratic, smarter than Sherlock, lazy' },
                    lestrade: { name: 'Inspector Lestrade', avatar: 'https://via.placeholder.com/120x120/FF9800/white?text=Lestrade', personality: 'determined, often confused, appreciates help' },
                    mrs_hudson: { name: 'Mrs. Hudson', avatar: 'https://via.placeholder.com/120x120/E91E63/white?text=Hudson', personality: 'motherly, patient, secretly tough' }
                },
                scenes: {
                    'sherlock-watson': [
                        { speaker: 'sherlock', text: "The game is afoot, Watson. Observe the peculiar scratches on this doorframe." },
                        { speaker: 'watson', text: "They look like ordinary scratches to me, Holmes. Perhaps from a key?" },
                        { speaker: 'sherlock', text: "Ordinary? My dear fellow, nothing is ordinary when viewed through the lens of deduction." },
                        { speaker: 'watson', text: "Alright then, what do these scratches tell you?" },
                        { speaker: 'sherlock', text: "The perpetrator is left-handed, approximately five feet eight inches tall, and owns a terrier." },
                        { speaker: 'watson', text: "A terrier? How on earth do you deduce that from scratches?" },
                        { speaker: 'sherlock', text: "Elementary! The height of the scratches, the angle of approach, and these small bite marks." },
                        { speaker: 'watson', text: "Sometimes I wonder if you're making half of this up, Holmes." }
                    ],
                    'sherlock-moriarty': [
                        { speaker: 'sherlock', text: "Moriarty. I should have known you were behind this elaborate scheme." },
                        { speaker: 'moriarty', text: "Oh Sherlock, you flatter me. Though 'elaborate' hardly does it justice." },
                        { speaker: 'sherlock', text: "Your methods are becoming increasingly theatrical. Are you seeking attention?" },
                        { speaker: 'moriarty', text: "From you? Always. What's the point of being a criminal mastermind without a worthy adversary?" },
                        { speaker: 'sherlock', text: "I'm afraid I'll have to disappoint you by solving this rather quickly." },
                        { speaker: 'moriarty', text: "Oh, but that's where you're wrong. This time, I'm three steps ahead." },
                        { speaker: 'sherlock', text: "We shall see about that." },
                        { speaker: 'moriarty', text: "Indeed we shall. The game, as you say, is afoot." }
                    ],
                    'mycroft-lestrade': [
                        { speaker: 'mycroft', text: "Inspector Lestrade, I trust my brother is being... cooperative with your investigation?" },
                        { speaker: 'lestrade', text: "Cooperative? He just told me my deduction was 'painfully obvious to a child.'" },
                        { speaker: 'mycroft', text: "Ah, he's being kind today. Usually he's much more... direct." },
                        { speaker: 'lestrade', text: "More direct? How is that possible?" },
                        { speaker: 'mycroft', text: "Trust me, Inspector. Sherlock has many levels of condescension." },
                        { speaker: 'lestrade', text: "And I suppose you're going to tell me you're even worse?" },
                        { speaker: 'mycroft', text: "Oh no, Inspector. I'm far too polite to point out your obvious shortcomings." },
                        { speaker: 'lestrade', text: "Right. The Holmes family charm is truly something to behold." }
                    ]
                }
            },
            'marvel': {
                title: 'Marvel - Avengers Compound & Missions',
                characters: {
                    ironman: { name: 'Tony Stark', avatar: 'https://via.placeholder.com/120x120/F44336/white?text=Tony', personality: 'genius, billionaire, sarcastic' },
                    captain: { name: 'Steve Rogers', avatar: 'https://via.placeholder.com/120x120/2196F3/white?text=Steve', personality: 'righteous, leader, old-fashioned' },
                    thor: { name: 'Thor Odinson', avatar: 'https://via.placeholder.com/120x120/FF9800/white?text=Thor', personality: 'godly, boastful, noble' },
                    hulk: { name: 'Bruce Banner', avatar: 'https://via.placeholder.com/120x120/4CAF50/white?text=Bruce', personality: 'scientific, calm, inner rage' },
                    natasha: { name: 'Natasha Romanoff', avatar: 'https://via.placeholder.com/120x120/9C27B0/white?text=Natasha', personality: 'spy, tactical, mysterious' },
                    hawkeye: { name: 'Clint Barton', avatar: 'https://via.placeholder.com/120x120/795548/white?text=Clint', personality: 'archer, family man, practical' }
                },
                scenes: {
                    'ironman-captain': [
                        { speaker: 'ironman', text: "Cap, we need to talk about your shield-throwing technique. It's very... vintage." },
                        { speaker: 'captain', text: "My technique has served me well for over seventy years, Stark." },
                        { speaker: 'ironman', text: "Sure, but have you considered adding some repulsors? Maybe a tracking system?" },
                        { speaker: 'captain', text: "Sometimes the old ways are the best ways, Tony." },
                        { speaker: 'ironman', text: "And sometimes they're just old. I could upgrade that shield with nanotechnology." },
                        { speaker: 'captain', text: "This shield is made of vibranium. It doesn't need upgrading." },
                        { speaker: 'ironman', text: "Everything can be improved, Rogers. That's called progress." },
                        { speaker: 'captain', text: "Did you just call me Capsicle again?" }
                    ],
                    'thor-hulk': [
                        { speaker: 'thor', text: "Banner, my friend! How fares the beast within?" },
                        { speaker: 'hulk', text: "Thor, please don't refer to the Hulk as 'the beast.' He's... sensitive about that." },
                        { speaker: 'thor', text: "Ah, my apologies! How fares the... mighty green warrior within?" },
                        { speaker: 'hulk', text: "Better. Though he still gets annoyed when people underestimate him." },
                        { speaker: 'thor', text: "Underestimate? The Hulk is one of the strongest beings I have ever encountered!" },
                        { speaker: 'hulk', text: "You should tell him that. He likes compliments." },
                        { speaker: 'thor', text: "Very well! Hulk, you are magnificent in battle!" },
                        { speaker: 'hulk', text: "He says... thank you. And that you're not bad for a 'sparkly hammer guy.'" }
                    ],
                    'natasha-hawkeye': [
                        { speaker: 'natasha', text: "Clint, your aim was off by two degrees on that last mission." },
                        { speaker: 'hawkeye', text: "Two degrees? Nat, I hit the target dead center!" },
                        { speaker: 'natasha', text: "I'm talking about the optimal trajectory for maximum psychological impact." },
                        { speaker: 'hawkeye', text: "Sometimes I forget you analyze everything like a chess game." },
                        { speaker: 'natasha', text: "That's what keeps us alive. Speaking of which, Laura called." },
                        { speaker: 'hawkeye', text: "Everything okay at home?" },
                        { speaker: 'natasha', text: "She wants to know when you're bringing me over for dinner again." },
                        { speaker: 'hawkeye', text: "Anytime, Nat. You know you're family." }
                    ]
                }
            },
            'star-wars': {
                title: 'Star Wars - Galaxy Far, Far Away',
                characters: {
                    luke: { name: 'Luke Skywalker', avatar: 'https://via.placeholder.com/120x120/607D8B/white?text=Luke', personality: 'hopeful, impulsive, heroic' },
                    vader: { name: 'Darth Vader', avatar: 'https://via.placeholder.com/120x120/212121/white?text=Vader', personality: 'dark, powerful, conflicted' },
                    leia: { name: 'Princess Leia', avatar: 'https://via.placeholder.com/120x120/E91E63/white?text=Leia', personality: 'strong-willed, leader, sarcastic' },
                    han: { name: 'Han Solo', avatar: 'https://via.placeholder.com/120x120/795548/white?text=Han', personality: 'cocky, smuggler, loyal' },
                    obi_wan: { name: 'Obi-Wan Kenobi', avatar: 'https://via.placeholder.com/120x120/4CAF50/white?text=Obi-Wan', personality: 'wise, patient, mentor' },
                    yoda: { name: 'Master Yoda', avatar: 'https://via.placeholder.com/120x120/9C27B0/white?text=Yoda', personality: 'ancient, wise, cryptic' }
                },
                scenes: {
                    'luke-vader': [
                        { speaker: 'vader', text: "Luke, you do not yet realize your importance. You have only begun to discover your power." },
                        { speaker: 'luke', text: "I'll never join you! You killed my father!" },
                        { speaker: 'vader', text: "No, Luke. I am your father." },
                        { speaker: 'luke', text: "No... that's not true! That's impossible!" },
                        { speaker: 'vader', text: "Search your feelings, Luke. You know it to be true." },
                        { speaker: 'luke', text: "No! No! I'll never turn to the dark side!" },
                        { speaker: 'vader', text: "Join me, and together we can rule the galaxy as father and son." },
                        { speaker: 'luke', text: "I'll never join you!" }
                    ],
                    'han-leia': [
                        { speaker: 'han', text: "Come on, Princess. You know you're crazy about me." },
                        { speaker: 'leia', text: "I'd rather kiss a Wookiee." },
                        { speaker: 'han', text: "I can arrange that. You could use a good kiss." },
                        { speaker: 'leia', text: "Your overconfidence is your weakness." },
                        { speaker: 'han', text: "Your faith in your friends is yours." },
                        { speaker: 'leia', text: "It's not over yet." },
                        { speaker: 'han', text: "It is for me, sister. Look, I ain't in this for your revolution." },
                        { speaker: 'leia', text: "I love you." }
                    ],
                    'luke-yoda': [
                        { speaker: 'luke', text: "Master Yoda, I don't understand. How is the Force supposed to help me lift this?" },
                        { speaker: 'yoda', text: "Size matters not. Look at me. Judge me by my size, do you?" },
                        { speaker: 'luke', text: "Well, no, but this is different. This is huge!" },
                        { speaker: 'yoda', text: "No different! Only different in your mind. You must unlearn what you have learned." },
                        { speaker: 'luke', text: "All right, I'll give it a try." },
                        { speaker: 'yoda', text: "No! Try not. Do, or do not. There is no try." },
                        { speaker: 'luke', text: "I can't. It's too big." },
                        { speaker: 'yoda', text: "That is why you fail." }
                    ]
                }
            },
            'harry-potter': {
                title: 'Harry Potter - Hogwarts School',
                characters: {
                    harry: { name: 'Harry Potter', avatar: 'https://via.placeholder.com/120x120/4CAF50/white?text=Harry', personality: 'brave, loyal, sometimes reckless' },
                    hermione: { name: 'Hermione Granger', avatar: 'https://via.placeholder.com/120x120/FF9800/white?text=Hermione', personality: 'brilliant, bookish, rule-following' },
                    ron: { name: 'Ron Weasley', avatar: 'https://via.placeholder.com/120x120/F44336/white?text=Ron', personality: 'loyal, insecure, funny' },
                    snape: { name: 'Severus Snape', avatar: 'https://via.placeholder.com/120x120/212121/white?text=Snape', personality: 'cold, mysterious, complex' },
                    dumbledore: { name: 'Albus Dumbledore', avatar: 'https://via.placeholder.com/120x120/9C27B0/white?text=Dumbledore', personality: 'wise, eccentric, powerful' },
                    draco: { name: 'Draco Malfoy', avatar: 'https://via.placeholder.com/120x120/607D8B/white?text=Draco', personality: 'arrogant, privileged, conflicted' }
                },
                scenes: {
                    'harry-hermione': [
                        { speaker: 'harry', text: "Hermione, I don't think we should be sneaking around the castle at night." },
                        { speaker: 'hermione', text: "Harry, we have to find out what's behind that door. It could be dangerous." },
                        { speaker: 'harry', text: "That's exactly why we shouldn't be doing this!" },
                        { speaker: 'hermione', text: "Since when do you care about breaking rules?" },
                        { speaker: 'harry', text: "Since we almost got expelled last time!" },
                        { speaker: 'hermione', text: "We didn't get expelled, did we? Besides, this is for the greater good." },
                        { speaker: 'harry', text: "You're starting to sound like Dumbledore." },
                        { speaker: 'hermione', text: "I'll take that as a compliment." }
                    ],
                    'ron-draco': [
                        { speaker: 'ron', text: "Well, well. If it isn't Malfoy and his gang of Slytherin goons." },
                        { speaker: 'draco', text: "Watch your mouth, Weasley. At least I don't have to wear hand-me-down robes." },
                        { speaker: 'ron', text: "At least I don't have to buy my friends, Malfoy." },
                        { speaker: 'draco', text: "Better than having no money to buy anything at all." },
                        { speaker: 'ron', text: "You know what, Malfoy? At least my family doesn't bow down to You-Know-Who." },
                        { speaker: 'draco', text: "My father will hear about this, Weasley!" },
                        { speaker: 'ron', text: "Oh no, not your father! I'm so scared!" },
                        { speaker: 'draco', text: "You should be, blood traitor." }
                    ],
                    'snape-dumbledore': [
                        { speaker: 'snape', text: "Albus, I must protest. Potter is becoming increasingly reckless." },
                        { speaker: 'dumbledore', text: "Severus, the boy shows remarkable courage for his age." },
                        { speaker: 'snape', text: "Courage? He's arrogant, just like his father." },
                        { speaker: 'dumbledore', text: "And yet, he has his mother's heart. Surely you can see that." },
                        { speaker: 'snape', text: "What I see is a boy who thinks the rules don't apply to him." },
                        { speaker: 'dumbledore', text: "Perhaps that is exactly what we need in these dark times." },
                        { speaker: 'snape', text: "You're putting too much faith in a child, Albus." },
                        { speaker: 'dumbledore', text: "And you, Severus, underestimate the power of love and friendship." }
                    ]
                }
            }
        };
        
        // Current movie selection and character pairing
        this.selectedMovie = 'family-guy';
        this.selectedCharacterPair = null;
        this.dialogData = null;
        
        // Voting system
        this.myVote = null;
        this.partnerVote = null;
        this.votingComplete = false;
        
        // Animation instances
        this.searchAnimation = null;
        this.matchAnimation = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupSpeechRecognition();
        
        // Mobile optimizations
        this.adjustUIForMobile();
        
        // Show landing screen immediately
        this.showScreen('landing-screen');
    }
    
    async startSearchAnimation() {
        try {
            const container = document.getElementById('loading-animation');
            if (!container) {
                console.error('Loading animation container not found');
                return;
            }
            
            // Clear any existing content
            container.innerHTML = '';
            
            // Destroy any existing animation
            if (this.searchAnimation) {
                this.searchAnimation.destroy();
                this.searchAnimation = null;
            }
            
            // Load the search animation from the JSON file
            const response = await fetch('./Search.json');
            const searchAnimationData = await response.json();
            
            this.searchAnimation = lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: searchAnimationData
            });
            
            console.log('Search animation loaded successfully');
        } catch (error) {
            console.error('Failed to load search animation:', error);
            // Fallback to simple spinner
            const container = document.getElementById('loading-animation');
            if (container) {
                container.innerHTML = '<div class="loading-spinner"></div>';
            }
        }
    }
    
    showMatchFound() {
        console.log('Showing match found screen...');
        
        this.showScreen('match-found-screen');
        
        // Start match animation after a brief delay to ensure DOM is ready
        setTimeout(() => {
            this.startMatchAnimation();
        }, 100);
        
        // Continue to character selection after showing match animation
        setTimeout(() => {
            this.loadCharactersForMovie('family-guy');
            this.showScreen('setup-screen');
        }, 3000);
    }
    
    async startMatchAnimation() {
        try {
            const container = document.getElementById('match-animation');
            if (!container) {
                console.error('Match animation container not found');
                return;
            }
            
            // Clear any existing content
            container.innerHTML = '';
            
            // Destroy any existing animation
            if (this.matchAnimation) {
                this.matchAnimation.destroy();
                this.matchAnimation = null;
            }
            
            // Load the match animation from the JSON file
            const response = await fetch('./success confetti.json');
            if (!response.ok) {
                throw new Error(`Failed to fetch animation: ${response.status}`);
            }
            
            const matchAnimationData = await response.json();
            
            this.matchAnimation = lottie.loadAnimation({
                container: container,
                renderer: 'svg',
                loop: false,
                autoplay: true,
                animationData: matchAnimationData
            });
            
            console.log('Match animation loaded successfully');
        } catch (error) {
            console.error('Failed to load match animation:', error);
            // Fallback to simple success message
            const container = document.getElementById('match-animation');
            if (container) {
                container.innerHTML = '<div style="font-size: 4rem; color: #4CAF50;">✅</div>';
            }
        }
    }
    
    startFromLanding() {
        console.log('Starting from landing page...');
        
        // Show loading screen with search animation
        this.showScreen('loading-screen');
        
        // Start search animation after a brief delay to ensure DOM is ready
        setTimeout(() => {
            this.startSearchAnimation();
        }, 100);
        
        // Update loading message
        document.getElementById('loading-message').textContent = 'Searching for a learning partner...';
        
        // Initialize peer connection only when user starts
        this.initializePeerJS();
        
        // Simulate finding a match
        setTimeout(() => {
            this.showMatchFound();
        }, 3000);
    }
    
    setupEventListeners() {
        // Landing page buttons
        document.getElementById('get-started-btn').addEventListener('click', () => this.startFromLanding());
        document.getElementById('start-practicing-btn').addEventListener('click', () => this.startFromLanding());
        
        // Start session
        document.getElementById('start-session').addEventListener('click', () => this.startSession());
        
        // Recording button - improved event handling
        const recordBtn = document.getElementById('record-btn');
        
        // Mouse events
        recordBtn.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.startRecording();
        });
        recordBtn.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.stopRecording();
        });
        recordBtn.addEventListener('mouseleave', (e) => {
            e.preventDefault();
            this.stopRecording();
        });
        
        // Touch events for mobile
        recordBtn.addEventListener('touchstart', (e) => {
            e.preventDefault();
            this.startRecording();
        });
        recordBtn.addEventListener('touchend', (e) => {
            e.preventDefault();
            this.stopRecording();
        });
        recordBtn.addEventListener('touchcancel', (e) => {
            e.preventDefault();
            this.stopRecording();
        });
        
        // Keyboard support (spacebar)
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && !this.isRecording && this.isMyTurn()) {
                e.preventDefault();
                this.startRecording();
            }
        });
        document.addEventListener('keyup', (e) => {
            if (e.code === 'Space' && this.isRecording) {
                e.preventDefault();
                this.stopRecording();
            }
        });
        
        // Movie selection
        document.querySelectorAll('.movie-card').forEach(card => {
            card.addEventListener('click', () => this.voteForMovie(card.dataset.movie));
        });
        document.getElementById('start-with-selection').addEventListener('click', () => this.startWithSelectedMovie());
        
        // Control buttons
        document.getElementById('skip-btn').addEventListener('click', () => this.skipDialog());
        document.getElementById('next-scene-btn').addEventListener('click', () => this.nextScene());
        document.getElementById('end-session-btn').addEventListener('click', () => this.endSession());
        document.getElementById('new-session-btn').addEventListener('click', () => this.newSession());
        document.getElementById('different-scene-btn').addEventListener('click', () => this.nextScene());
    }
    
    setupSpeechRecognition() {
        // Initialize speech recognition properties
        this.speechMethod = null;
        this.mediaRecorder = null;
        this.audioChunks = [];
        this.stream = null;
        
        // Word definition system
        this.wordDefinitionCache = new Map();
        this.currentDefinitionPopup = null;
        
        // Simple word definitions database (in a real app, this would use an API)
        this.wordDefinitions = {
            'hello': {
                pronunciation: '/həˈloʊ/',
                partOfSpeech: 'interjection',
                definition: 'Used as a greeting or to begin a phone conversation.',
                example: 'Hello, how are you today?'
            },
            'hey': {
                pronunciation: '/heɪ/',
                partOfSpeech: 'interjection',
                definition: 'Used as a greeting or to attract attention.',
                example: 'Hey there, how are you?'
            },
            'remember': {
                pronunciation: '/rɪˈmembər/',
                partOfSpeech: 'verb',
                definition: 'To have in or be able to bring to one\'s mind an awareness of (someone or something from the past).',
                example: 'I remember that day clearly.'
            },
            'world': {
                pronunciation: '/wɜːrld/',
                partOfSpeech: 'noun',
                definition: 'The earth, together with all of its countries and peoples.',
                example: 'She traveled around the world.'
            },
            'remember': {
                pronunciation: '/rɪˈmembər/',
                partOfSpeech: 'verb',
                definition: 'To have in or be able to bring to one\'s mind an awareness of someone or something from the past.',
                example: 'I remember my first day at school.'
            },
            'chicken': {
                pronunciation: '/ˈtʃɪkən/',
                partOfSpeech: 'noun',
                definition: 'A domestic fowl kept for its eggs or meat.',
                example: 'We had chicken for dinner.'
            },
            'fought': {
                pronunciation: '/fɔːt/',
                partOfSpeech: 'verb',
                definition: 'Past tense of fight; engaged in battle or combat.',
                example: 'The soldiers fought bravely.'
            },
            'domination': {
                pronunciation: '/ˌdɑːməˈneɪʃən/',
                partOfSpeech: 'noun',
                definition: 'The exercise of control or influence over someone or something.',
                example: 'The empire sought world domination.'
            },
            'impressive': {
                pronunciation: '/ɪmˈpresɪv/',
                partOfSpeech: 'adjective',
                definition: 'Evoking admiration through size, quality, or skill.',
                example: 'That was an impressive performance.'
            },
            'sophisticated': {
                pronunciation: '/səˈfɪstəˌkeɪtəd/',
                partOfSpeech: 'adjective',
                definition: 'Having great knowledge or experience of the world and refined tastes.',
                example: 'She has sophisticated tastes in art.'
            },
            'scheme': {
                pronunciation: '/skiːm/',
                partOfSpeech: 'noun',
                definition: 'A large-scale systematic plan or arrangement.',
                example: 'They devised a scheme to raise money.'
            },
            'pathetic': {
                pronunciation: '/pəˈθetɪk/',
                partOfSpeech: 'adjective',
                definition: 'Arousing pity, especially through vulnerability or sadness.',
                example: 'It was a pathetic sight.'
            },
            'plans': {
                pronunciation: '/plænz/',
                partOfSpeech: 'noun',
                definition: 'Detailed proposals for doing or achieving something.',
                example: 'We made plans for the weekend.'
            },
            'achievable': {
                pronunciation: '/əˈtʃiːvəbəl/',
                partOfSpeech: 'adjective',
                definition: 'Able to be brought about or reached successfully.',
                example: 'The goal is achievable with hard work.'
            },
            'minions': {
                pronunciation: '/ˈmɪnjənz/',
                partOfSpeech: 'noun',
                definition: 'Followers or underlings of a powerful person.',
                example: 'The villain sent his minions to do his bidding.'
            },
            'obsession': {
                pronunciation: '/əbˈseʃən/',
                partOfSpeech: 'noun',
                definition: 'An idea or thought that continually preoccupies a person\'s mind.',
                example: 'His obsession with cleanliness was well known.'
            },
            'professional': {
                pronunciation: '/prəˈfeʃənəl/',
                partOfSpeech: 'adjective',
                definition: 'Relating to or connected with a profession.',
                example: 'She maintained a professional attitude.'
            },
            'qualification': {
                pronunciation: '/ˌkwɑːlɪfɪˈkeɪʃən/',
                partOfSpeech: 'noun',
                definition: 'A quality or accomplishment that makes someone suitable for a job or activity.',
                example: 'Experience is an important qualification for this job.'
            },
            'seasoning': {
                pronunciation: '/ˈsiːzənɪŋ/',
                partOfSpeech: 'noun',
                definition: 'Salt, herbs, or spices added to food to enhance flavor.',
                example: 'The soup needs more seasoning.'
            },
            'tolerate': {
                pronunciation: '/ˈtɑːləreɪt/',
                partOfSpeech: 'verb',
                definition: 'Allow the existence of something without interference.',
                example: 'I can barely tolerate this noise.'
            },
            'prankster': {
                pronunciation: '/ˈpræŋkstər/',
                partOfSpeech: 'noun',
                definition: 'A person who plays pranks on others.',
                example: 'Jim is known as the office prankster.'
            },
            'inappropriate': {
                pronunciation: '/ˌɪnəˈproʊpriət/',
                partOfSpeech: 'adjective',
                definition: 'Not suitable or proper in the circumstances.',
                example: 'That comment was inappropriate for the meeting.'
            },
            'expenses': {
                pronunciation: '/ɪkˈspensəz/',
                partOfSpeech: 'noun',
                definition: 'The cost required for something; money spent.',
                example: 'Keep track of your business expenses.'
            },
            'recipe': {
                pronunciation: '/ˈresəpi/',
                partOfSpeech: 'noun',
                definition: 'A set of instructions for preparing a dish.',
                example: 'Do you have a recipe for chocolate cake?'
            },
            'paleontologist': {
                pronunciation: '/ˌpeɪliənˈtɑːlədʒɪst/',
                partOfSpeech: 'noun',
                definition: 'A scientist who studies fossils and ancient life.',
                example: 'The paleontologist discovered dinosaur bones.'
            },
            'fashionable': {
                pronunciation: '/ˈfæʃənəbəl/',
                partOfSpeech: 'adjective',
                definition: 'Characteristic of or influenced by current fashion.',
                example: 'She always wears fashionable clothes.'
            },
            'competitive': {
                pronunciation: '/kəmˈpetətɪv/',
                partOfSpeech: 'adjective',
                definition: 'Having a strong desire to be more successful than others.',
                example: 'She\'s very competitive in sports.'
            },
            'sarcastic': {
                pronunciation: '/sɑːrˈkæstɪk/',
                partOfSpeech: 'adjective',
                definition: 'Marked by or given to using irony to mock or convey contempt.',
                example: 'His sarcastic comment hurt her feelings.'
            },
            'commitment': {
                pronunciation: '/kəˈmɪtmənt/',
                partOfSpeech: 'noun',
                definition: 'The state of being dedicated to a cause or activity.',
                example: 'Marriage requires commitment from both partners.'
            },
            'peculiar': {
                pronunciation: '/pɪˈkjuːljər/',
                partOfSpeech: 'adjective',
                definition: 'Strange or odd; unusual.',
                example: 'There was something peculiar about his behavior.'
            },
            'deduction': {
                pronunciation: '/dɪˈdʌkʃən/',
                partOfSpeech: 'noun',
                definition: 'The action of deducing or inferring something.',
                example: 'Through deduction, he solved the mystery.'
            },
            'perpetrator': {
                pronunciation: '/ˈpɜːrpətreɪtər/',
                partOfSpeech: 'noun',
                definition: 'A person who carries out a harmful or illegal act.',
                example: 'The police caught the perpetrator.'
            },
            'elaborate': {
                pronunciation: '/ɪˈlæbərət/',
                partOfSpeech: 'adjective',
                definition: 'Involving many carefully arranged parts; detailed.',
                example: 'They made elaborate plans for the party.'
            },
            'theatrical': {
                pronunciation: '/θiˈætrɪkəl/',
                partOfSpeech: 'adjective',
                definition: 'Exaggerated and excessively dramatic.',
                example: 'His theatrical gestures amused everyone.'
            },
            'adversary': {
                pronunciation: '/ˈædvərˌseri/',
                partOfSpeech: 'noun',
                definition: 'One\'s opponent in a contest or conflict.',
                example: 'He faced a formidable adversary in court.'
            },
            'condescension': {
                pronunciation: '/ˌkɑːndɪˈsenʃən/',
                partOfSpeech: 'noun',
                definition: 'An attitude of patronizing superiority.',
                example: 'His condescension was obvious to everyone.'
            },
            'shortcomings': {
                pronunciation: '/ˈʃɔːrtkʌmɪŋz/',
                partOfSpeech: 'noun',
                definition: 'Faults or failures to meet standards.',
                example: 'Everyone has their shortcomings.'
            }
        };
        
        // Enhanced browser detection for Opera GX compatibility
        this.detectBrowser();
        
        // Check for native Web Speech API support with Opera GX fixes
        if ('webkitSpeechRecognition' in window) {
            this.speechMethod = 'webkit';
            this.recognition = new webkitSpeechRecognition();
            this.setupNativeSpeechRecognition();
        } else if ('SpeechRecognition' in window) {
            this.speechMethod = 'native';
            this.recognition = new SpeechRecognition();
            this.setupNativeSpeechRecognition();
        } else {
            // Fallback to Web Audio API recording
            this.speechMethod = 'webaudio';
            console.log('Native speech recognition not supported, using Web Audio API fallback');
            this.setupWebAudioRecording();
        }
    }
    
    detectBrowser() {
        const userAgent = navigator.userAgent.toLowerCase();
        this.browserInfo = {
            isOpera: userAgent.includes('opr') || userAgent.includes('opera'),
            isOperaGX: userAgent.includes('opr') && userAgent.includes('gx'),
            isChrome: userAgent.includes('chrome') && !userAgent.includes('opr'),
            isFirefox: userAgent.includes('firefox'),
            isSafari: userAgent.includes('safari') && !userAgent.includes('chrome'),
            isEdge: userAgent.includes('edg')
        };
        
        console.log('Browser detected:', this.browserInfo);
        
        // Opera GX specific optimizations
        if (this.browserInfo.isOperaGX) {
            console.log('Opera GX detected - applying compatibility fixes');
            this.applyOperaGXFixes();
        }
    }
    
    applyOperaGXFixes() {
        // Opera GX specific speech recognition fixes
        if (window.webkitSpeechRecognition) {
            // Override default settings for Opera GX
            this.originalWebkitSpeechRecognition = window.webkitSpeechRecognition;
        }
        
        // Add Opera GX specific event listeners
        window.addEventListener('beforeunload', () => {
            this.cleanupResources();
        });
        
        // Handle Opera GX's aggressive memory management
        this.setupOperaGXMemoryManagement();
    }
    
    setupOperaGXMemoryManagement() {
        // Prevent Opera GX from killing the speech recognition
        let keepAliveInterval = setInterval(() => {
            if (this.recognition && this.isRecording) {
                // Send a small ping to keep the connection alive
                try {
                    this.recognition.abort();
                    setTimeout(() => {
                        if (this.isRecording && this.isMyTurn()) {
                            this.recognition.start();
                        }
                    }, 100);
                } catch (e) {
                    console.log('Keep-alive ping failed:', e);
                }
            }
        }, 30000); // Every 30 seconds
        
        // Store interval for cleanup
        this.keepAliveInterval = keepAliveInterval;
    }
    
    cleanupResources() {
        // Clean up Opera GX resources
        if (this.keepAliveInterval) {
            clearInterval(this.keepAliveInterval);
        }
        
        if (this.recognition) {
            try {
                this.recognition.abort();
            } catch (e) {
                console.log('Error aborting recognition:', e);
            }
        }
        
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
    }
    
    setupNativeSpeechRecognition() {
        this.recognition.continuous = false;
        this.recognition.interimResults = false;
        this.recognition.lang = 'en-US';
        this.recognition.maxAlternatives = 3;
        
        // Mobile optimizations
        if (this.isMobileDevice()) {
            // Shorter timeout for mobile
            this.recognition.interimResults = true; // Better for mobile feedback
        }
        
        // Opera GX specific settings
        if (this.browserInfo && this.browserInfo.isOperaGX) {
            this.recognition.continuous = true; // Opera GX works better with continuous mode
            this.recognition.interimResults = true; // Enable interim results for better feedback
            console.log('Applied Opera GX speech recognition optimizations');
        }
        
        this.recognition.onstart = () => {
            console.log('Native speech recognition started');
            this.updateMicIndicator(true);
        };
        
        this.recognition.onresult = (event) => {
            console.log('Speech recognition result:', event);
            if (event.results && event.results.length > 0) {
                const transcript = event.results[0][0].transcript.trim();
                console.log('Final transcript:', transcript);
                this.processSpeechResult(transcript);
            } else {
                this.showSpeechFeedback('No speech detected. Please try again.', 'error');
            }
        };
        
        this.recognition.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            let errorMessage = 'Speech recognition error. Please try again.';
            
            switch (event.error) {
                case 'no-speech':
                    errorMessage = 'No speech detected. Please speak clearly into your microphone.';
                    break;
                case 'audio-capture':
                    errorMessage = 'Microphone not accessible. Please check your microphone permissions.';
                    break;
                case 'not-allowed':
                    errorMessage = 'Microphone access denied. Please allow microphone access and refresh the page.';
                    break;
                case 'network':
                    errorMessage = 'Network error. Please check your internet connection.';
                    break;
                case 'service-not-allowed':
                    errorMessage = 'Speech recognition service not allowed. Please check your browser settings.';
                    break;
                case 'bad-grammar':
                    errorMessage = 'Speech recognition grammar error. Please try again.';
                    break;
                case 'language-not-supported':
                    errorMessage = 'Language not supported. Please try English.';
                    break;
            }
            
            this.showSpeechFeedback(errorMessage, 'error');
            this.stopRecording();
            
            // Opera GX specific error recovery
            if (this.browserInfo && this.browserInfo.isOperaGX) {
                setTimeout(() => {
                    this.showSpeechFeedback('Opera GX detected: Try refreshing the page if issues persist.', 'partial');
                }, 2000);
            }
        };
        
        this.recognition.onend = () => {
            console.log('Speech recognition ended');
            this.updateMicIndicator(false);
        };
    }
    
    async setupWebAudioRecording() {
        try {
            // Check if getUserMedia is supported
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('getUserMedia not supported');
            }
            
            // Check if MediaRecorder is supported
            if (!window.MediaRecorder) {
                throw new Error('MediaRecorder not supported');
            }
            
            console.log('Web Audio API recording initialized');
            this.showSpeechFeedback('Speech recognition ready! Using advanced audio recording for better browser compatibility.', 'success');
            
        } catch (error) {
            console.error('Web Audio setup failed:', error);
            this.showSpeechFeedback('Speech recognition not available in this browser. Please try Chrome, Firefox, or Edge.', 'error');
        }
    }
    
    initializePeerJS() {
        // For demo purposes, we'll simulate peer connection
        // In a real app, you'd use PeerJS or Socket.IO for real P2P connection
        this.simulatePeerConnection();
    }
    
    simulatePeerConnection() {
        // Simulate connection process
        setTimeout(() => {
            this.updateConnectionStatus('connected', 'Connected to partner');
            this.showMovieSelection();
        }, 3000);
    }
    
    showMovieSelection() {
        // Show partner info in movie selection
        const partnerCharacter = this.currentCharacter === 'peter' ? 'stewie' : 'peter';
        const partnerAvatar = this.movieDatabase['family-guy'].characters[partnerCharacter].avatar;
        const partnerName = this.movieDatabase['family-guy'].characters[partnerCharacter].name;
        
        document.getElementById('partner-avatar-small').src = partnerAvatar;
        document.getElementById('partner-name-display').textContent = partnerName;
        
        this.showScreen('movie-selection-screen');
        
        // Simulate partner voting after a delay
        setTimeout(() => {
            this.simulatePartnerVote();
        }, 5000 + Math.random() * 5000); // 5-10 seconds
    }
    
    selectCharacter(character) {
        // Remove previous selection
        document.querySelectorAll('.character-card').forEach(card => {
            card.classList.remove('selected');
        });
        
        // Select new character
        const selectedCard = document.querySelector(`[data-character="${character}"]`);
        selectedCard.classList.add('selected');
        
        this.currentCharacter = character;
        document.getElementById('start-session').disabled = false;
    }
    
    loadCharactersForMovie(movieId) {
        const movieData = this.movieDatabase[movieId];
        const characterContainer = document.getElementById('character-selection-container');
        
        // Clear existing characters
        characterContainer.innerHTML = '';
        
        // Create character cards for the selected movie
        Object.keys(movieData.characters).forEach((characterKey, index) => {
            const character = movieData.characters[characterKey];
            const characterCard = document.createElement('div');
            characterCard.className = 'character-card';
            characterCard.dataset.character = characterKey;
            
            characterCard.innerHTML = `
                <img src="${character.avatar}" alt="${character.name}">
                <h3>${character.name}</h3>
                <p class="character-personality">${character.personality}</p>
                <p class="character-source">from ${movieData.title}</p>
            `;
            
            characterCard.addEventListener('click', () => this.selectCharacter(characterKey));
            characterContainer.appendChild(characterCard);
        });
        
        // Reset selection state
        this.currentCharacter = null;
        document.getElementById('start-session').disabled = true;
    }
    
    generateSceneForCharacters(char1, char2, movieId) {
        const movieData = this.movieDatabase[movieId];
        
        // Try to find a predefined scene for this character pairing
        const pairKey1 = `${char1}-${char2}`;
        const pairKey2 = `${char2}-${char1}`;
        
        if (movieData.scenes && movieData.scenes[pairKey1]) {
            return movieData.scenes[pairKey1];
        } else if (movieData.scenes && movieData.scenes[pairKey2]) {
            return movieData.scenes[pairKey2];
        }
        
        // If no predefined scene exists, generate a dynamic one
        return this.generateDynamicScene(char1, char2, movieData);
    }
    
    generateDynamicScene(char1, char2, movieData) {
        const character1 = movieData.characters[char1];
        const character2 = movieData.characters[char2];
        
        // Generate dynamic dialogs based on character personalities
        const dynamicDialogs = [
            { speaker: char1, text: `Hey ${character2.name}, how's your day going?` },
            { speaker: char2, text: `Oh, you know, ${character1.name}. Same old, same old.` },
            { speaker: char1, text: `I've been thinking about what you said earlier.` },
            { speaker: char2, text: `Which part? I say a lot of things.` },
            { speaker: char1, text: `About how we should work together more often.` },
            { speaker: char2, text: `That could be interesting. What did you have in mind?` },
            { speaker: char1, text: `Well, we both have our strengths, right?` },
            { speaker: char2, text: `True. I suppose we could give it a try.` },
            { speaker: char1, text: `Great! This could be the start of something good.` },
            { speaker: char2, text: `Let's hope so, ${character1.name}. Let's hope so.` }
        ];
        
        return dynamicDialogs;
    }
    
    getCharacterPairKey(char1, char2) {
        // Always return characters in alphabetical order for consistency
        return char1 < char2 ? `${char1}-${char2}` : `${char2}-${char1}`;
    }
    
    voteForMovie(movieId) {
        // Clear previous vote
        if (this.myVote) {
            const prevCard = document.querySelector(`[data-movie="${this.myVote}"]`);
            const prevIndicator = document.getElementById(`vote-${this.myVote}`);
            prevCard.classList.remove('selected');
            prevIndicator.classList.remove('my-vote', 'both-votes');
            prevIndicator.textContent = '';
        }
        
        // Set new vote
        this.myVote = movieId;
        const movieCard = document.querySelector(`[data-movie="${movieId}"]`);
        const voteIndicator = document.getElementById(`vote-${movieId}`);
        
        movieCard.classList.add('selected');
        voteIndicator.classList.add('my-vote');
        voteIndicator.textContent = '👤';
        
        // Update voting status
        document.getElementById('voting-status').innerHTML = 
            `<p>You voted for <strong>${this.movieDatabase[movieId].title}</strong>. Waiting for partner...</p>`;
        
        this.checkVotingComplete();
    }
    
    simulatePartnerVote() {
        if (this.partnerVote || this.votingComplete) return;
        
        // Partner randomly votes for a movie (with slight bias toward family-guy)
        const movies = Object.keys(this.movieDatabase);
        let randomMovie;
        
        // 30% chance to vote for family-guy, 70% chance for random
        if (Math.random() < 0.3) {
            randomMovie = 'family-guy';
        } else {
            randomMovie = movies[Math.floor(Math.random() * movies.length)];
        }
        
        this.receivePartnerVote(randomMovie);
    }
    
    receivePartnerVote(movieId) {
        this.partnerVote = movieId;
        const voteIndicator = document.getElementById(`vote-${movieId}`);
        
        if (this.myVote === movieId) {
            // Both voted for the same movie
            voteIndicator.classList.remove('my-vote');
            voteIndicator.classList.add('both-votes');
            voteIndicator.textContent = '🤝';
            
            const movieCard = document.querySelector(`[data-movie="${movieId}"]`);
            movieCard.classList.add('both-voted');
        } else {
            // Partner voted for different movie
            voteIndicator.classList.add('partner-vote');
            voteIndicator.textContent = '👥';
        }
        
        // Update partner status
        document.getElementById('partner-vote-status').textContent = 'Voted!';
        document.getElementById('partner-vote-status').classList.add('voted');
        
        this.checkVotingComplete();
    }
    
    checkVotingComplete() {
        if (!this.myVote || !this.partnerVote) return;
        
        if (this.myVote === this.partnerVote) {
            // Both voted for the same movie - can start!
            this.votingComplete = true;
            this.selectedMovie = this.myVote;
            
            document.getElementById('voting-status').innerHTML = 
                `<p class="match-found">🎉 Both players chose <strong>${this.movieDatabase[this.selectedMovie].title}</strong>!</p>`;
            document.getElementById('start-with-selection').disabled = false;
            
            // Auto-start after a delay
            setTimeout(() => {
                this.startWithSelectedMovie();
            }, 3000);
        } else {
            // Different votes - show conflict resolution
            document.getElementById('voting-status').innerHTML = 
                `<p>Vote mismatch! You chose <strong>${this.movieDatabase[this.myVote].title}</strong>, 
                 partner chose <strong>${this.movieDatabase[this.partnerVote].title}</strong>. 
                 Try voting for the same movie!</p>`;
        }
    }
    
    startWithSelectedMovie() {
        if (!this.votingComplete) return;
        
        // Load characters for the selected movie and show character selection
        // Dialog data will be generated when both players select their characters
        this.loadCharactersForMovie(this.selectedMovie);
        this.showScreen('setup-screen');
    }
    
    startSession() {
        this.sessionStartTime = new Date();
        this.currentDialogIndex = 0;
        this.correctDialogs = 0;
        
        // Generate scene based on character choices
        const partnerCharacter = this.getPartnerCharacter();
        this.selectedCharacterPair = this.getCharacterPairKey(this.currentCharacter, partnerCharacter);
        this.dialogData = this.generateSceneForCharacters(this.currentCharacter, partnerCharacter, this.selectedMovie);
        this.totalDialogs = this.dialogData.length;
        
        // Update scene title with character names
        const movieData = this.movieDatabase[this.selectedMovie];
        const myCharName = movieData.characters[this.currentCharacter].name;
        const partnerCharName = movieData.characters[partnerCharacter].name;
        document.getElementById('scene-title').textContent = 
            `${movieData.title}: ${myCharName} & ${partnerCharName}`;
        
        this.updatePlayerInfo();
        this.showScreen('learning-screen');
        this.displayCurrentDialog();
    }
    
    getPartnerCharacter() {
        // For demo purposes, simulate partner character selection
        // In a real app, this would come from the actual partner
        const movieData = this.movieDatabase[this.selectedMovie];
        const allCharacters = Object.keys(movieData.characters);
        const availableCharacters = allCharacters.filter(char => char !== this.currentCharacter);
        
        // Return a random available character for now
        return availableCharacters[Math.floor(Math.random() * availableCharacters.length)];
    }
    
    updatePlayerInfo() {
        // User gets their selected character, partner gets the other one
        const movieData = this.movieDatabase[this.selectedMovie];
        const characterKeys = Object.keys(movieData.characters);
        const myCharacterKey = this.currentCharacter; // User's selected character
        const partnerCharacterKey = characterKeys.find(key => key !== myCharacterKey); // Partner gets the other one
        
        const myCharacter = movieData.characters[myCharacterKey];
        const partnerCharacter = movieData.characters[partnerCharacterKey];
        
        // Update current user info
        document.getElementById('peer1-avatar').src = myCharacter.avatar;
        document.getElementById('peer1-name').textContent = myCharacter.name;
        
        // Update partner info
        document.getElementById('peer2-avatar').src = partnerCharacter.avatar;
        document.getElementById('peer2-name').textContent = partnerCharacter.name;
        
        // Store character keys for dialog checking
        this.partnerCharacter = partnerCharacterKey;
    }
    
    displayCurrentDialog() {
        if (this.currentDialogIndex >= this.dialogData.length) {
            this.completeSession();
            return;
        }
        
        const dialog = this.dialogData[this.currentDialogIndex];
        const isMyTurn = dialog.speaker === this.currentCharacter;
        const movieData = this.movieDatabase[this.selectedMovie];
        
        document.getElementById('current-speaker').textContent = 
            movieData.characters[dialog.speaker].name;
        document.getElementById('dialog-number').textContent = 
            `${this.currentDialogIndex + 1}/${this.dialogData.length}`;
        
        // Create interactive text with clickable words
        this.createInteractiveText(dialog.text);
        
        // Update dialog card styling
        const dialogCard = document.getElementById('current-dialog');
        dialogCard.classList.remove('current-turn', 'error');
        
        if (isMyTurn) {
            dialogCard.classList.add('current-turn');
            document.getElementById('record-btn').style.display = 'block';
        } else {
            document.getElementById('record-btn').style.display = 'none';
            // Simulate partner speaking (in real app, this would be actual peer audio)
            setTimeout(() => {
                this.nextDialog();
            }, 3000 + Math.random() * 2000); // Random delay 3-5 seconds
        }
        
        this.updateProgress();
    }
    
    isMyTurn() {
        const dialog = this.dialogData[this.currentDialogIndex];
        return dialog && dialog.speaker === this.currentCharacter;
    }
    
    async startRecording() {
        console.log('startRecording called', { speechMethod: this.speechMethod, isRecording: this.isRecording, isMyTurn: this.isMyTurn() });
        
        if (!this.speechMethod) {
            this.showSpeechFeedback('Speech recognition not supported in this browser. Please use a modern browser like Chrome, Firefox, or Edge.', 'error');
            return;
        }
        
        if (this.isRecording) {
            console.log('Already recording, ignoring');
            return;
        }
        
        if (!this.isMyTurn()) {
            this.showSpeechFeedback("It's not your turn to speak!", 'error');
            return;
        }
        
        // Enhanced connection stability check for Opera GX
        if (this.browserInfo && this.browserInfo.isOperaGX) {
            console.log('Opera GX: Performing connection stability check');
            const connectionOk = await this.performConnectionCheck();
            if (!connectionOk) {
                return;
            }
        }
        
        this.isRecording = true;
        const recordBtn = document.getElementById('record-btn');
        recordBtn.classList.add('recording');
        recordBtn.innerHTML = '🔴 Recording... <small>(Release to stop)</small>';
        
        // Clear previous feedback
        this.hideSpeechFeedback();
        this.clearDialogHighlights();
        
        // Show visual recording indicator
        const dialogCard = document.getElementById('current-dialog');
        dialogCard.classList.add('recording');
        
        try {
            if (this.speechMethod === 'webkit' || this.speechMethod === 'native') {
                console.log('Starting native speech recognition...');
                this.recognition.start();
            } else if (this.speechMethod === 'webaudio') {
                console.log('Starting Web Audio recording...');
                await this.startWebAudioRecording();
            }
        } catch (error) {
            console.error('Failed to start recording:', error);
            this.showSpeechFeedback('Failed to start recording. Please try again.', 'error');
            this.stopRecording();
            
            // Opera GX specific retry logic
            if (this.browserInfo && this.browserInfo.isOperaGX && this.connectionRetries < this.maxRetries) {
                this.connectionRetries++;
                console.log(`Opera GX retry attempt ${this.connectionRetries}/${this.maxRetries}`);
                setTimeout(() => {
                    this.startRecording();
                }, 1000);
            }
        }
    }
    
    async performConnectionCheck() {
        try {
            // Test microphone access
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop());
            console.log('Opera GX: Microphone access confirmed');
            return true;
        } catch (error) {
            console.error('Opera GX: Microphone access failed:', error);
            this.showSpeechFeedback('Opera GX: Please check microphone permissions and try again.', 'error');
            return false;
        }
    }
    
    async startWebAudioRecording() {
        try {
            // Request microphone access
            this.stream = await navigator.mediaDevices.getUserMedia({ 
                audio: {
                    echoCancellation: true,
                    noiseSuppression: true,
                    sampleRate: 44100
                } 
            });
            
            // Create MediaRecorder
            const options = {
                mimeType: 'audio/webm;codecs=opus'
            };
            
            // Fallback MIME types for different browsers
            if (!MediaRecorder.isTypeSupported(options.mimeType)) {
                if (MediaRecorder.isTypeSupported('audio/webm')) {
                    options.mimeType = 'audio/webm';
                } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
                    options.mimeType = 'audio/mp4';
                } else {
                    options.mimeType = '';
                }
            }
            
            this.mediaRecorder = new MediaRecorder(this.stream, options);
            this.audioChunks = [];
            
            this.mediaRecorder.ondataavailable = (event) => {
                if (event.data.size > 0) {
                    this.audioChunks.push(event.data);
                }
            };
            
            this.mediaRecorder.onstop = () => {
                console.log('MediaRecorder stopped');
                this.processWebAudioRecording();
            };
            
            this.mediaRecorder.onerror = (event) => {
                console.error('MediaRecorder error:', event.error);
                this.showSpeechFeedback('Recording error. Please try again.', 'error');
                this.stopRecording();
            };
            
            this.mediaRecorder.start();
            this.updateMicIndicator(true);
            console.log('Web Audio recording started');
            
        } catch (error) {
            console.error('Error starting Web Audio recording:', error);
            this.showSpeechFeedback('Could not access microphone. Please check your permissions.', 'error');
            this.stopRecording();
        }
    }
    
    async processWebAudioRecording() {
        try {
            if (this.audioChunks.length === 0) {
                this.showSpeechFeedback('No audio recorded. Please try again.', 'error');
                return;
            }
            
            // Create audio blob
            const audioBlob = new Blob(this.audioChunks, { 
                type: this.mediaRecorder.mimeType || 'audio/webm' 
            });
            
            console.log('Audio recorded:', {
                size: audioBlob.size,
                type: audioBlob.type,
                duration: 'unknown'
            });
            
            // For now, simulate speech recognition with a simple text input
            // In a real implementation, you would send this to a speech recognition service
            this.simulateSpeechRecognition(audioBlob);
            
        } catch (error) {
            console.error('Error processing audio:', error);
            this.showSpeechFeedback('Error processing audio. Please try again.', 'error');
        }
    }
    
    simulateSpeechRecognition(audioBlob) {
        // This is a temporary simulation - in a real app you would:
        // 1. Send the audioBlob to your server
        // 2. Use a service like Google Cloud Speech-to-Text, Azure Speech, or AWS Transcribe
        // 3. Return the transcript to the client
        
        // For demo purposes, show a text input interface
        this.showTextInputFallback();
    }
    
    showTextInputFallback() {
        const expectedText = this.dialogData[this.currentDialogIndex].text;
        
        // Create a better UI for text input fallback
        const feedbackHtml = `
            <div class="feedback-header">🎤 Speech Recognition Fallback</div>
            <div class="feedback-details">
                <div><strong>Expected dialog:</strong> "${expectedText}"</div>
                <div class="text-input-container">
                    <input type="text" id="speech-text-input" placeholder="Type what you said..." class="speech-text-input">
                    <div class="text-input-buttons">
                        <button id="submit-text-input" class="text-input-btn primary">Submit</button>
                        <button id="cancel-text-input" class="text-input-btn secondary">Cancel</button>
                    </div>
                </div>
                <div class="feedback-tip">Your browser doesn't support native speech recognition, so please type your response.</div>
            </div>
        `;
        
        this.showSpeechFeedback(feedbackHtml, 'partial');
        
        // Focus on the input field
        setTimeout(() => {
            const textInput = document.getElementById('speech-text-input');
            if (textInput) {
                textInput.focus();
                
                // Handle Enter key
                textInput.addEventListener('keypress', (e) => {
                    if (e.key === 'Enter') {
                        this.submitTextInput();
                    }
                });
            }
            
            // Handle button clicks
            const submitBtn = document.getElementById('submit-text-input');
            const cancelBtn = document.getElementById('cancel-text-input');
            
            if (submitBtn) {
                submitBtn.addEventListener('click', () => this.submitTextInput());
            }
            
            if (cancelBtn) {
                cancelBtn.addEventListener('click', () => this.cancelTextInput());
            }
        }, 100);
    }
    
    submitTextInput() {
        const textInput = document.getElementById('speech-text-input');
        if (textInput && textInput.value.trim()) {
            this.processSpeechResult(textInput.value.trim());
            this.hideSpeechFeedback();
        } else {
            this.showSpeechFeedback('Please enter some text or click Cancel.', 'error');
        }
    }
    
    cancelTextInput() {
        this.hideSpeechFeedback();
        this.showSpeechFeedback('Recording cancelled. Click the microphone to try again.', 'error');
    }
    
    stopRecording() {
        console.log('stopRecording called', { isRecording: this.isRecording, speechMethod: this.speechMethod });
        
        if (!this.isRecording) return;
        
        this.isRecording = false;
        const recordBtn = document.getElementById('record-btn');
        recordBtn.classList.remove('recording');
        recordBtn.innerHTML = '🎤 Hold to Speak <small>(or press Space)</small>';
        
        // Remove recording visual indicator
        const dialogCard = document.getElementById('current-dialog');
        dialogCard.classList.remove('recording');
        
        try {
            if (this.speechMethod === 'webkit' || this.speechMethod === 'native') {
                if (this.recognition) {
                    this.recognition.stop();
                }
            } else if (this.speechMethod === 'webaudio') {
                this.stopWebAudioRecording();
            }
        } catch (error) {
            console.error('Error stopping recording:', error);
        }
    }
    
    stopWebAudioRecording() {
        try {
            if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
                this.mediaRecorder.stop();
            }
            
            if (this.stream) {
                this.stream.getTracks().forEach(track => track.stop());
                this.stream = null;
            }
            
            this.updateMicIndicator(false);
            console.log('Web Audio recording stopped');
            
        } catch (error) {
            console.error('Error stopping Web Audio recording:', error);
        }
    }
    
    processSpeechResult(transcript) {
        const expectedText = this.dialogData[this.currentDialogIndex].text;
        const cleanExpected = expectedText.replace(/[^\w\s]/g, '').toLowerCase().trim();
        const cleanTranscript = transcript.replace(/[^\w\s]/g, '').toLowerCase().trim();
        
        const similarity = this.calculateSimilarity(cleanTranscript, cleanExpected);
        const wordAccuracy = this.calculateWordAccuracy(cleanTranscript, cleanExpected);
        
        console.log('Transcript:', transcript);
        console.log('Expected:', expectedText);
        console.log('Similarity:', similarity);
        console.log('Word Accuracy:', wordAccuracy);
        
        // Clear previous highlights
        this.clearDialogHighlights();
        
        if (similarity > 0.7 || wordAccuracy > 0.6) { // Success threshold
            this.correctDialogs++;
            this.showSuccessFeedback(transcript, expectedText);
            this.highlightDialog('success');
            setTimeout(() => this.nextDialog(), 2000);
        } else if (similarity > 0.4 || wordAccuracy > 0.3) { // Partial match
            this.showPartialFeedback(transcript, expectedText, wordAccuracy);
            this.highlightDialog('partial');
        } else {
            this.showErrorFeedback(transcript, expectedText);
            this.highlightDialog('error');
        }
    }
    
    calculateSimilarity(str1, str2) {
        // Improved similarity calculation using Levenshtein distance
        const words1 = str1.split(/\s+/).filter(w => w.length > 0);
        const words2 = str2.split(/\s+/).filter(w => w.length > 0);
        
        let matches = 0;
        const maxLength = Math.max(words1.length, words2.length);
        
        words1.forEach(word => {
            // Check for exact matches or close matches
            const exactMatch = words2.includes(word);
            const closeMatch = words2.some(w2 => this.levenshteinDistance(word, w2) <= 1 && word.length > 2);
            
            if (exactMatch || closeMatch) {
                matches++;
            }
        });
        
        return maxLength > 0 ? matches / maxLength : 0;
    }
    
    calculateWordAccuracy(spoken, expected) {
        const spokenWords = spoken.split(/\s+/).filter(w => w.length > 0);
        const expectedWords = expected.split(/\s+/).filter(w => w.length > 0);
        
        let correctWords = 0;
        
        spokenWords.forEach(spokenWord => {
            expectedWords.forEach(expectedWord => {
                if (spokenWord === expectedWord || 
                    (spokenWord.length > 2 && expectedWord.length > 2 && 
                     this.levenshteinDistance(spokenWord, expectedWord) <= 1)) {
                    correctWords++;
                }
            });
        });
        
        return expectedWords.length > 0 ? correctWords / expectedWords.length : 0;
    }
    
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }
    
    showSpeechFeedback(message, type) {
        const feedback = document.getElementById('speech-feedback');
        feedback.innerHTML = message;
        feedback.className = `speech-feedback ${type}`;
        feedback.classList.remove('hidden');
        
        // Auto-hide after 5 seconds for error messages
        if (type === 'error') {
            setTimeout(() => {
                this.hideSpeechFeedback();
            }, 5000);
        }
    }
    
    showSuccessFeedback(transcript, expected) {
        const message = `
            <div class="feedback-header">✅ Perfect!</div>
            <div class="feedback-details">
                <div><strong>You said:</strong> "${transcript}"</div>
                <div><strong>Expected:</strong> "${expected}"</div>
            </div>
        `;
        this.showSpeechFeedback(message, 'success');
    }
    
    showPartialFeedback(transcript, expected, accuracy) {
        const percentage = Math.round(accuracy * 100);
        const message = `
            <div class="feedback-header">⚠️ Close! (${percentage}% match)</div>
            <div class="feedback-details">
                <div><strong>You said:</strong> "${transcript}"</div>
                <div><strong>Try saying:</strong> "${expected}"</div>
                <div class="feedback-tip">Try to match the words more closely</div>
            </div>
        `;
        this.showSpeechFeedback(message, 'partial');
    }
    
    showErrorFeedback(transcript, expected) {
        const message = `
            <div class="feedback-header">❌ Try Again</div>
            <div class="feedback-details">
                <div><strong>You said:</strong> "${transcript || 'Nothing detected'}"</div>
                <div><strong>Please say:</strong> "${expected}"</div>
                <div class="feedback-tip">Speak clearly and match the dialog exactly</div>
            </div>
        `;
        this.showSpeechFeedback(message, 'error');
    }
    
    highlightDialog(type) {
        const dialogCard = document.getElementById('current-dialog');
        const dialogText = document.getElementById('dialog-text');
        
        // Remove previous highlights
        this.clearDialogHighlights();
        
        // Add new highlight
        dialogCard.classList.add(`feedback-${type}`);
        dialogText.classList.add(`text-${type}`);
        
        // Auto-remove highlights after animation
        setTimeout(() => {
            this.clearDialogHighlights();
        }, 3000);
    }
    
    clearDialogHighlights() {
        const dialogCard = document.getElementById('current-dialog');
        const dialogText = document.getElementById('dialog-text');
        
        dialogCard.classList.remove('feedback-success', 'feedback-partial', 'feedback-error', 'recording');
        dialogText.classList.remove('text-success', 'text-partial', 'text-error');
    }
    
    hideSpeechFeedback() {
        document.getElementById('speech-feedback').classList.add('hidden');
    }
    
    updateMicIndicator(active) {
        const micIndicator = document.getElementById('peer1-mic');
        if (active) {
            micIndicator.classList.add('active');
        } else {
            micIndicator.classList.remove('active');
        }
    }
    
    nextDialog() {
        this.currentDialogIndex++;
        this.displayCurrentDialog();
    }
    
    skipDialog() {
        this.nextDialog();
    }
    
    updateProgress() {
        const progress = (this.currentDialogIndex / this.dialogData.length) * 100;
        document.getElementById('progress-fill').style.width = `${progress}%`;
        document.getElementById('progress-text').textContent = 
            `${this.currentDialogIndex}/${this.dialogData.length} dialogs completed`;
    }
    
    completeSession() {
        const sessionTime = new Date() - this.sessionStartTime;
        const minutes = Math.floor(sessionTime / 60000);
        const seconds = Math.floor((sessionTime % 60000) / 1000);
        
        const accuracy = Math.round((this.correctDialogs / this.totalDialogs) * 100);
        
        document.getElementById('accuracy-score').textContent = `${accuracy}%`;
        document.getElementById('dialogs-completed').textContent = 
            `${this.correctDialogs}/${this.totalDialogs}`;
        document.getElementById('session-time').textContent = 
            `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        this.showScreen('results-screen');
    }
    
    endSession() {
        if (confirm('Are you sure you want to end the session?')) {
            this.completeSession();
        }
    }
    
    newSession() {
        this.currentDialogIndex = 0;
        this.correctDialogs = 0;
        this.currentCharacter = null;
        this.partnerCharacter = null;
        this.myVote = null;
        this.partnerVote = null;
        this.votingComplete = false;
        this.selectedMovie = 'family-guy';
        
        // IMPORTANT: Clear previous dialog data to prevent old scenes from showing
        this.dialogData = null;
        this.selectedCharacterPair = null;
        this.totalDialogs = 0;
        
        // Reset UI
        document.querySelectorAll('.movie-card').forEach(card => {
            card.classList.remove('selected', 'both-voted');
        });
        document.querySelectorAll('.vote-indicator').forEach(indicator => {
            indicator.className = 'vote-indicator';
            indicator.textContent = '';
        });
        document.getElementById('start-session').disabled = true;
        document.getElementById('start-with-selection').disabled = true;
        
        // Load default characters and show setup
        this.loadCharactersForMovie('family-guy');
        this.showScreen('setup-screen');
    }
    
    nextScene() {
        // Go back to movie selection for a different scene
        this.resetVotingState();
        this.showMovieSelection();
    }
    
    resetVotingState() {
        this.myVote = null;
        this.partnerVote = null;
        this.votingComplete = false;
        
        // IMPORTANT: Clear previous dialog data when switching scenes
        this.dialogData = null;
        this.selectedCharacterPair = null;
        this.currentCharacter = null;
        this.partnerCharacter = null;
        this.currentDialogIndex = 0;
        this.totalDialogs = 0;
        
        // Reset UI
        document.querySelectorAll('.movie-card').forEach(card => {
            card.classList.remove('selected', 'both-voted');
        });
        document.querySelectorAll('.vote-indicator').forEach(indicator => {
            indicator.className = 'vote-indicator';
            indicator.textContent = '';
        });
        document.getElementById('start-with-selection').disabled = true;
        document.getElementById('voting-status').innerHTML = 
            '<p>Select a movie to vote. Both players must agree to start.</p>';
        document.getElementById('partner-vote-status').textContent = 'Choosing...';
        document.getElementById('partner-vote-status').classList.remove('voted');
        
        // Simulate new partner vote after delay
        setTimeout(() => {
            this.simulatePartnerVote();
        }, 5000 + Math.random() * 5000);
    }
    
    updateConnectionStatus(status, message) {
        const indicator = document.getElementById('connection-indicator');
        const text = document.getElementById('connection-text');
        
        indicator.className = `status-dot ${status}`;
        text.textContent = message;
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        document.getElementById(screenId).classList.remove('hidden');
    }
    
    // Interactive Word Definition System
    createInteractiveText(text) {
        const dialogTextElement = document.getElementById('dialog-text');
        
        if (!dialogTextElement) {
            console.error('dialog-text element not found');
            return;
        }
        
        // Split text into words while preserving punctuation and spacing
        const words = text.split(/(\s+|[.,!?;:"'-])/);
        
        dialogTextElement.innerHTML = '';
        
        words.forEach(word => {
            if (word.trim() && /^[a-zA-Z]+$/.test(word)) {
                // This is a word that can have a definition
                const wordElement = document.createElement('span');
                wordElement.className = 'interactive-word';
                wordElement.textContent = word;
                wordElement.dataset.word = word.toLowerCase();
                
                // Add click/tap event for word definition
                wordElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Word clicked:', word);
                    this.showWordDefinition(word.toLowerCase(), wordElement);
                });
                
                // Also add touch event for mobile
                wordElement.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Word touched:', word);
                    this.showWordDefinition(word.toLowerCase(), wordElement);
                });
                
                dialogTextElement.appendChild(wordElement);
            } else {
                // This is punctuation or whitespace
                const textNode = document.createTextNode(word);
                dialogTextElement.appendChild(textNode);
            }
        });
        
        // Store bound function to properly remove it later
        if (!this.boundHandleDocumentClick) {
            this.boundHandleDocumentClick = this.handleDocumentClick.bind(this);
        }
        
        // Remove existing event listener to prevent duplicates
        document.removeEventListener('click', this.boundHandleDocumentClick);
        // Add event listener to close popup when clicking elsewhere
        document.addEventListener('click', this.boundHandleDocumentClick);
        
        console.log('Interactive text created with', words.length, 'elements');
    }
    
    handleDocumentClick(e) {
        if (this.currentDefinitionPopup && 
            !this.currentDefinitionPopup.contains(e.target) && 
            !e.target.classList.contains('interactive-word')) {
            this.hideWordDefinition();
        }
    }
    
    async showWordDefinition(word, element) {
        console.log('showWordDefinition called for word:', word);
        
        // Hide any existing popup
        this.hideWordDefinition();
        
        // Mark word as selected
        document.querySelectorAll('.interactive-word.selected').forEach(el => {
            el.classList.remove('selected');
        });
        element.classList.add('selected');
        
        // Show loading tooltip
        this.showSimpleTooltip(element, `Loading definition for "${word}"...`);
        
        try {
            // Get word definition
            const definition = await this.getWordDefinition(word);
            
            // Hide loading tooltip
            this.hideWordDefinition();
            
            if (!definition) {
                this.showSimpleTooltip(element, `"${word}" - Tap to hear pronunciation`);
                return;
            }
            
            // Create popup
            const popup = this.createDefinitionPopup(word, definition);
            document.body.appendChild(popup);
            
            // Position popup
            this.positionPopup(popup, element);
            
            // Show popup with animation
            setTimeout(() => {
                popup.classList.add('show');
            }, 10);
            
            this.currentDefinitionPopup = popup;
            
        } catch (error) {
            console.error('Error showing word definition:', error);
            this.hideWordDefinition();
            this.showSimpleTooltip(element, `Error loading definition for "${word}"`);
        }
    }
    
    async getWordDefinition(word) {
        // Check cache first
        if (this.wordDefinitionCache.has(word)) {
            return this.wordDefinitionCache.get(word);
        }
        
        try {
            // Try to fetch from Free Dictionary API
            const apiDefinition = await this.fetchFromDictionaryAPI(word);
            if (apiDefinition) {
                this.wordDefinitionCache.set(word, apiDefinition);
                return apiDefinition;
            }
        } catch (error) {
            console.log('API fetch failed, trying local definitions:', error.message);
        }
        
        // Fallback to local definitions
        if (this.wordDefinitions[word]) {
            this.wordDefinitionCache.set(word, this.wordDefinitions[word]);
            return this.wordDefinitions[word];
        }
        
        // Final fallback for unknown words
        const genericDefinition = {
            pronunciation: this.generatePhoneticPronunciation(word),
            partOfSpeech: 'word',
            definition: `"${word}" - Click the speaker button to hear pronunciation`,
            example: `Example: "${word}" is used in this sentence.`,
            audioUrl: null
        };
        
        this.wordDefinitionCache.set(word, genericDefinition);
        return genericDefinition;
    }
    
    async fetchFromDictionaryAPI(word) {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
            
            if (!response.ok) {
                throw new Error(`API responded with status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data && data.length > 0) {
                const entry = data[0];
                const meaning = entry.meanings && entry.meanings[0];
                const definition = meaning && meaning.definitions && meaning.definitions[0];
                
                // Get pronunciation
                let pronunciation = '';
                let audioUrl = null;
                
                if (entry.phonetics && entry.phonetics.length > 0) {
                    // Find phonetic with text
                    const phoneticWithText = entry.phonetics.find(p => p.text);
                    if (phoneticWithText) {
                        pronunciation = phoneticWithText.text;
                    }
                    
                    // Find audio URL (prefer US pronunciation)
                    const phoneticWithAudio = entry.phonetics.find(p => p.audio && p.audio.includes('us')) || 
                                            entry.phonetics.find(p => p.audio);
                    if (phoneticWithAudio && phoneticWithAudio.audio) {
                        audioUrl = phoneticWithAudio.audio;
                    }
                }
                
                // Fallback pronunciation from word itself
                if (!pronunciation) {
                    pronunciation = this.generatePhoneticPronunciation(word);
                }
                
                return {
                    pronunciation: pronunciation,
                    partOfSpeech: meaning ? meaning.partOfSpeech : 'word',
                    definition: definition ? definition.definition : `Definition for "${word}"`,
                    example: definition && definition.example ? definition.example : null,
                    audioUrl: audioUrl,
                    synonyms: definition && definition.synonyms ? definition.synonyms.slice(0, 3) : null,
                    antonyms: definition && definition.antonyms ? definition.antonyms.slice(0, 3) : null
                };
            }
        } catch (error) {
            console.error('Dictionary API error:', error);
            throw error;
        }
        
        return null;
    }
    
    generatePhoneticPronunciation(word) {
        // Simple phonetic approximation - in a real app, use a proper API
        return `/${word.replace(/e$/, 'ə').replace(/a/g, 'æ')}/`;
    }
    
    createDefinitionPopup(word, definition) {
        const popup = document.createElement('div');
        popup.className = 'word-definition-popup';
        
        // Build synonyms and antonyms sections
        let synonymsHtml = '';
        if (definition.synonyms && definition.synonyms.length > 0) {
            synonymsHtml = `
                <div class="word-synonyms">
                    <strong>Synonyms:</strong> ${definition.synonyms.join(', ')}
                </div>
            `;
        }
        
        let antonymsHtml = '';
        if (definition.antonyms && definition.antonyms.length > 0) {
            antonymsHtml = `
                <div class="word-antonyms">
                    <strong>Antonyms:</strong> ${definition.antonyms.join(', ')}
                </div>
            `;
        }
        
        popup.innerHTML = `
            <div class="word-definition-header">
                <div>
                    <div class="word-definition-word">${word}</div>
                    <div class="word-pronunciation">${definition.pronunciation}</div>
                </div>
                <button class="word-definition-close">&times;</button>
            </div>
            <div class="word-definition-content">
                <div class="word-part-of-speech">${definition.partOfSpeech}</div>
                <div class="word-definition-text">${definition.definition}</div>
                ${definition.example ? `<div class="word-example">"${definition.example}"</div>` : ''}
                ${synonymsHtml}
                ${antonymsHtml}
            </div>
            <div class="word-pronunciation-controls">
                ${definition.audioUrl ? 
                    `<button class="pronunciation-btn api-audio" data-word="${word}" data-audio-url="${definition.audioUrl}">
                        🔊 Listen (API)
                    </button>` : ''
                }
                <button class="pronunciation-btn tts-audio" data-word="${word}">
                    🔊 Listen (TTS)
                </button>
            </div>
        `;
        
        // Add event listeners
        popup.querySelector('.word-definition-close').addEventListener('click', () => {
            this.hideWordDefinition();
        });
        
        // API audio button
        const apiAudioBtn = popup.querySelector('.pronunciation-btn.api-audio');
        if (apiAudioBtn) {
            apiAudioBtn.addEventListener('click', (e) => {
                this.playAPIAudio(definition.audioUrl, e.target);
            });
        }
        
        // TTS audio button
        const ttsAudioBtn = popup.querySelector('.pronunciation-btn.tts-audio');
        if (ttsAudioBtn) {
            ttsAudioBtn.addEventListener('click', (e) => {
                this.playWordPronunciation(word, e.target);
            });
        }
        
        return popup;
    }
    
    positionPopup(popup, element) {
        const elementRect = element.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        let left = elementRect.left + (elementRect.width / 2) - (popupRect.width / 2);
        let top = elementRect.bottom + 10;
        
        // Adjust horizontal position if popup goes off screen
        if (left < 10) {
            left = 10;
        } else if (left + popupRect.width > viewportWidth - 10) {
            left = viewportWidth - popupRect.width - 10;
        }
        
        // Check if popup goes below viewport
        if (top + popupRect.height > viewportHeight - 20) {
            // Position above the element instead
            top = elementRect.top - popupRect.height - 10;
            popup.classList.add('bottom');
        }
        
        // On mobile, center the popup
        if (window.innerWidth <= 768) {
            left = (viewportWidth - popupRect.width) / 2;
            top = (viewportHeight - popupRect.height) / 2;
        }
        
        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
    }
    
    showSimpleTooltip(element, message) {
        const tooltip = document.createElement('div');
        tooltip.className = 'word-definition-popup simple-tooltip';
        tooltip.textContent = message;
        
        document.body.appendChild(tooltip);
        this.positionPopup(tooltip, element);
        
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 10);
        
        this.currentDefinitionPopup = tooltip;
        
        // Auto-hide after 2 seconds
        setTimeout(() => {
            this.hideWordDefinition();
        }, 2000);
    }
    
    hideWordDefinition() {
        if (this.currentDefinitionPopup) {
            this.currentDefinitionPopup.classList.remove('show');
            setTimeout(() => {
                if (this.currentDefinitionPopup && this.currentDefinitionPopup.parentNode) {
                    this.currentDefinitionPopup.parentNode.removeChild(this.currentDefinitionPopup);
                }
                this.currentDefinitionPopup = null;
            }, 200);
        }
        
        // Remove selected state from words
        document.querySelectorAll('.interactive-word.selected').forEach(el => {
            el.classList.remove('selected');
        });
    }
    
    async playWordPronunciation(word, button) {
        button.classList.add('pronunciation-loading');
        button.textContent = '🔊 Playing...';
        
        try {
            // Use Web Speech API for pronunciation if available
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(word);
                utterance.rate = 0.8;
                utterance.pitch = 1;
                
                // Try to use a native English voice
                const voices = speechSynthesis.getVoices();
                const englishVoice = voices.find(voice => 
                    voice.lang.startsWith('en') && voice.localService
                ) || voices.find(voice => voice.lang.startsWith('en'));
                
                if (englishVoice) {
                    utterance.voice = englishVoice;
                }
                
                utterance.onend = () => {
                    button.classList.remove('pronunciation-loading');
                    button.textContent = '🔊 Listen';
                };
                
                utterance.onerror = () => {
                    button.classList.remove('pronunciation-loading');
                    button.textContent = '🔊 Listen';
                    this.showSpeechFeedback('Pronunciation not available', 'error');
                };
                
                speechSynthesis.speak(utterance);
            } else {
                // Fallback for browsers without speech synthesis
                button.classList.remove('pronunciation-loading');
                button.textContent = '🔊 Listen';
                this.showSpeechFeedback('Speech synthesis not supported in this browser', 'error');
            }
        } catch (error) {
            console.error('Error playing pronunciation:', error);
            button.classList.remove('pronunciation-loading');
            button.textContent = '🔊 Listen';
            this.showSpeechFeedback('Error playing pronunciation', 'error');
        }
    }
    
    async playAPIAudio(audioUrl, button) {
        button.classList.add('pronunciation-loading');
        button.textContent = '🔊 Playing...';
        
        try {
            // Create and play audio from API URL
            const audio = new Audio(audioUrl);
            
            audio.onended = () => {
                button.classList.remove('pronunciation-loading');
                button.textContent = '🔊 Listen (API)';
            };
            
            audio.onerror = () => {
                button.classList.remove('pronunciation-loading');
                button.textContent = '🔊 Listen (API)';
                this.showSpeechFeedback('Audio not available, try TTS instead', 'error');
            };
            
            audio.oncanplaythrough = () => {
                audio.play().catch(error => {
                    console.error('Error playing API audio:', error);
                    button.classList.remove('pronunciation-loading');
                    button.textContent = '🔊 Listen (API)';
                    this.showSpeechFeedback('Could not play audio, try TTS instead', 'error');
                });
            };
            
            // Load the audio
            audio.load();
            
        } catch (error) {
            console.error('Error with API audio:', error);
            button.classList.remove('pronunciation-loading');
            button.textContent = '🔊 Listen (API)';
            this.showSpeechFeedback('Audio error, try TTS instead', 'error');
        }
    }
    
    // Mobile Device Detection and Optimization
    isMobileDevice() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ||
               ('ontouchstart' in window) ||
               (navigator.maxTouchPoints > 0);
    }
    
    isTouchDevice() {
        return ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
    }
    
    // Enhanced mobile speech recognition
    optimizeMobileSpeechRecognition() {
        if (this.isMobileDevice() && this.recognition) {
            // Mobile-specific settings
            this.recognition.interimResults = true;
            
            // Handle mobile-specific events
            this.recognition.onspeechstart = () => {
                console.log('Speech detected on mobile');
                this.showSpeechFeedback('Listening... speak clearly', 'partial');
            };
            
            this.recognition.onspeechend = () => {
                console.log('Speech ended on mobile');
                this.hideSpeechFeedback();
            };
            
            // Mobile timeout handling
            this.recognition.onnomatch = () => {
                console.log('No match found on mobile');
                this.showSpeechFeedback('Could not understand. Please try again.', 'error');
            };
        }
    }
    
    // Touch gesture enhancements
    setupTouchGestures() {
        if (!this.isTouchDevice()) return;
        
        const recordBtn = document.getElementById('record-btn');
        
        // Prevent context menu on long press for record button
        recordBtn.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
        
        // Add haptic feedback if available
        recordBtn.addEventListener('touchstart', () => {
            if ('vibrate' in navigator) {
                navigator.vibrate(50); // Short vibration feedback
            }
        });
        
        // Optimize touch targets for mobile
        this.optimizeTouchTargets();
    }
    
    optimizeTouchTargets() {
        // Ensure all interactive elements meet minimum touch target size (44px)
        const interactiveElements = document.querySelectorAll('button, .interactive-word, .character-card, .movie-card');
        
        interactiveElements.forEach(element => {
            const rect = element.getBoundingClientRect();
            if (rect.height < 44 || rect.width < 44) {
                element.style.minHeight = '44px';
                element.style.minWidth = '44px';
                element.style.display = 'inline-flex';
                element.style.alignItems = 'center';
                element.style.justifyContent = 'center';
            }
        });
    }
    
    // Mobile-specific UI adjustments
    adjustUIForMobile() {
        if (this.isMobileDevice()) {
            // Adjust font sizes for better mobile readability
            document.body.classList.add('mobile-device');
            
            // Optimize viewport for mobile
            const viewport = document.querySelector('meta[name=viewport]');
            if (viewport) {
                viewport.setAttribute('content', 
                    'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover');
            }
            
            // Setup touch gestures
            this.setupTouchGestures();
            
            // Optimize speech recognition for mobile
            this.optimizeMobileSpeechRecognition();
        }
    }
    
    // Interactive Word Definition System
    createInteractiveText(text) {
        const dialogTextElement = document.getElementById('dialog-text');
        
        if (!dialogTextElement) {
            console.error('dialog-text element not found');
            return;
        }
        
        console.log('Creating interactive text for:', text);
        
        // Split text into words while preserving punctuation and spacing
        const words = text.split(/(\s+|[.,!?;:"'-])/);
        
        dialogTextElement.innerHTML = '';
        
        words.forEach(word => {
            if (word.trim() && /^[a-zA-Z]+$/.test(word)) {
                // This is a word that can have a definition
                const wordElement = document.createElement('span');
                wordElement.className = 'interactive-word';
                wordElement.textContent = word;
                wordElement.dataset.word = word.toLowerCase();
                
                // Add click/tap event for word definition
                wordElement.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Word clicked:', word);
                    this.showWordDefinition(word.toLowerCase(), wordElement);
                });
                
                // Also add touch event for mobile
                wordElement.addEventListener('touchend', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Word touched:', word);
                    this.showWordDefinition(word.toLowerCase(), wordElement);
                });
                
                dialogTextElement.appendChild(wordElement);
            } else {
                // This is punctuation or whitespace
                const textNode = document.createTextNode(word);
                dialogTextElement.appendChild(textNode);
            }
        });
        
        // Store bound function to properly remove it later
        if (!this.boundHandleDocumentClick) {
            this.boundHandleDocumentClick = this.handleDocumentClick.bind(this);
        }
        
        // Remove existing event listener to prevent duplicates
        document.removeEventListener('click', this.boundHandleDocumentClick);
        // Add event listener to close popup when clicking elsewhere
        document.addEventListener('click', this.boundHandleDocumentClick);
        
        console.log('Interactive text created with', words.length, 'elements');
    }
    
    handleDocumentClick(e) {
        if (this.currentDefinitionPopup && 
            !this.currentDefinitionPopup.contains(e.target) && 
            !e.target.classList.contains('interactive-word')) {
            this.hideWordDefinition();
        }
    }
    
    async showWordDefinition(word, element) {
        console.log('showWordDefinition called for word:', word);
        
        // Hide any existing popup
        this.hideWordDefinition();
        
        // Mark word as selected
        document.querySelectorAll('.interactive-word.selected').forEach(el => {
            el.classList.remove('selected');
        });
        element.classList.add('selected');
        
        // Show loading tooltip
        this.showSimpleTooltip(element, `Loading definition for "${word}"...`);
        
        try {
            // Get word definition
            const definition = await this.getWordDefinition(word);
            
            // Hide loading tooltip
            this.hideWordDefinition();
            
            if (!definition) {
                this.showSimpleTooltip(element, `"${word}" - Tap to hear pronunciation`);
                return;
            }
            
            // Create popup
            const popup = this.createDefinitionPopup(word, definition);
            document.body.appendChild(popup);
            
            // Position popup
            this.positionPopup(popup, element);
            
            // Show popup with animation
            setTimeout(() => {
                popup.classList.add('show');
            }, 10);
            
            this.currentDefinitionPopup = popup;
            
        } catch (error) {
            console.error('Error showing word definition:', error);
            this.hideWordDefinition();
            this.showSimpleTooltip(element, `Error loading definition for "${word}"`);
        }
    }
    
    async getWordDefinition(word) {
        console.log('Getting definition for word:', word);
        
        // Check cache first
        if (this.wordDefinitionCache.has(word)) {
            console.log('Found in cache:', word);
            return this.wordDefinitionCache.get(word);
        }
        
        try {
            // Try to fetch from Free Dictionary API
            const apiDefinition = await this.fetchFromDictionaryAPI(word);
            if (apiDefinition) {
                this.wordDefinitionCache.set(word, apiDefinition);
                return apiDefinition;
            }
        } catch (error) {
            console.log('API fetch failed, trying local definitions:', error.message);
        }
        
        // Fallback to local definitions
        if (this.wordDefinitions[word]) {
            console.log('Found in local definitions:', word);
            this.wordDefinitionCache.set(word, this.wordDefinitions[word]);
            return this.wordDefinitions[word];
        }
        
        // Final fallback for unknown words
        const genericDefinition = {
            pronunciation: this.generatePhoneticPronunciation(word),
            partOfSpeech: 'word',
            definition: `"${word}" - Click the pronunciation button to hear how it sounds.`,
            example: `Example usage of "${word}" in context.`,
            synonyms: [],
            antonyms: []
        };
        
        this.wordDefinitionCache.set(word, genericDefinition);
        return genericDefinition;
    }
    
    hideWordDefinition() {
        if (this.currentDefinitionPopup) {
            this.currentDefinitionPopup.remove();
            this.currentDefinitionPopup = null;
        }
        
        // Remove selected state from all words
        document.querySelectorAll('.interactive-word.selected').forEach(el => {
            el.classList.remove('selected');
        });
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.add('hidden');
        });
        document.getElementById(screenId).classList.remove('hidden');
    }
    
    createDefinitionPopup(word, definition) {
        const popup = document.createElement('div');
        popup.className = 'word-definition-popup';
        
        // Build synonyms and antonyms sections
        let synonymsHtml = '';
        if (definition.synonyms && definition.synonyms.length > 0) {
            synonymsHtml = `
                <div class="word-synonyms">
                    <strong>Synonyms:</strong> ${definition.synonyms.join(', ')}
                </div>
            `;
        }
        
        let antonymsHtml = '';
        if (definition.antonyms && definition.antonyms.length > 0) {
            antonymsHtml = `
                <div class="word-antonyms">
                    <strong>Antonyms:</strong> ${definition.antonyms.join(', ')}
                </div>
            `;
        }
        
        popup.innerHTML = `
            <div class="word-definition-header">
                <div>
                    <div class="word-definition-word">${word}</div>
                    <div class="word-pronunciation">${definition.pronunciation}</div>
                </div>
                <button class="word-definition-close">&times;</button>
            </div>
            <div class="word-definition-content">
                <div class="word-part-of-speech">${definition.partOfSpeech}</div>
                <div class="word-definition-text">${definition.definition}</div>
                ${definition.example ? `<div class="word-example">"${definition.example}"</div>` : ''}
                ${synonymsHtml}
                ${antonymsHtml}
            </div>
            <div class="word-pronunciation-controls">
                ${definition.audioUrl ? 
                    `<button class="pronunciation-btn api-audio" data-word="${word}" data-audio-url="${definition.audioUrl}">
                        🔊 Listen (API)
                    </button>` : ''
                }
                <button class="pronunciation-btn tts-audio" data-word="${word}">
                    🔊 Listen (TTS)
                </button>
            </div>
        `;
        
        // Add event listeners
        popup.querySelector('.word-definition-close').addEventListener('click', () => {
            this.hideWordDefinition();
        });
        
        // API audio button
        const apiAudioBtn = popup.querySelector('.pronunciation-btn.api-audio');
        if (apiAudioBtn) {
            apiAudioBtn.addEventListener('click', (e) => {
                this.playAPIAudio(definition.audioUrl, e.target);
            });
        }
        
        // TTS audio button
        const ttsAudioBtn = popup.querySelector('.pronunciation-btn.tts-audio');
        if (ttsAudioBtn) {
            ttsAudioBtn.addEventListener('click', (e) => {
                this.playWordPronunciation(word, e.target);
            });
        }
        
        return popup;
    }
    
    showSimpleTooltip(element, message) {
        // Hide any existing popup first
        this.hideWordDefinition();
        
        const tooltip = document.createElement('div');
        tooltip.className = 'word-definition-popup simple-tooltip';
        tooltip.textContent = message;
        
        document.body.appendChild(tooltip);
        this.positionPopup(tooltip, element);
        
        setTimeout(() => {
            tooltip.classList.add('show');
        }, 10);
        
        this.currentDefinitionPopup = tooltip;
        
        // Auto-hide simple tooltips after 3 seconds
        setTimeout(() => {
            if (this.currentDefinitionPopup === tooltip) {
                this.hideWordDefinition();
            }
        }, 3000);
    }
    
    positionPopup(popup, element) {
        const elementRect = element.getBoundingClientRect();
        const popupRect = popup.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        let left = elementRect.left + (elementRect.width / 2) - (popupRect.width / 2);
        let top = elementRect.bottom + 10;
        
        // Adjust horizontal position if popup goes off screen
        if (left < 10) {
            left = 10;
        } else if (left + popupRect.width > viewportWidth - 10) {
            left = viewportWidth - popupRect.width - 10;
        }
        
        // Check if popup goes below viewport
        if (top + popupRect.height > viewportHeight - 20) {
            // Position above the element instead
            top = elementRect.top - popupRect.height - 10;
            popup.classList.add('bottom');
        }
        
        // On mobile, center the popup
        if (window.innerWidth <= 768) {
            left = (viewportWidth - popupRect.width) / 2;
            top = (viewportHeight - popupRect.height) / 2;
        }
        
        popup.style.left = `${left}px`;
        popup.style.top = `${top}px`;
    }
    
    generatePhoneticPronunciation(word) {
        // Simple phonetic approximation
        return `/${word.toLowerCase()}/`;
    }
    
    async fetchFromDictionaryAPI(word) {
        try {
            const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
            if (!response.ok) throw new Error('API request failed');
            
            const data = await response.json();
            if (data && data[0]) {
                const entry = data[0];
                const meaning = entry.meanings?.[0];
                const definition = meaning?.definitions?.[0];
                
                return {
                    pronunciation: entry.phonetic || this.generatePhoneticPronunciation(word),
                    partOfSpeech: meaning?.partOfSpeech || 'word',
                    definition: definition?.definition || 'Definition not available',
                    example: definition?.example || '',
                    synonyms: definition?.synonyms || [],
                    antonyms: definition?.antonyms || [],
                    audioUrl: entry.phonetics?.find(p => p.audio)?.audio || null
                };
            }
        } catch (error) {
            console.log('Dictionary API error:', error);
            return null;
        }
    }
    
    async playWordPronunciation(word, button) {
        button.classList.add('pronunciation-loading');
        button.textContent = '🔊 Playing...';
        
        try {
            // Use Web Speech API for pronunciation if available
            if ('speechSynthesis' in window) {
                const utterance = new SpeechSynthesisUtterance(word);
                utterance.rate = 0.8;
                utterance.pitch = 1;
                
                utterance.onend = () => {
                    button.classList.remove('pronunciation-loading');
                    button.innerHTML = '🔊 Listen (TTS)';
                };
                
                speechSynthesis.speak(utterance);
            } else {
                throw new Error('Speech synthesis not supported');
            }
        } catch (error) {
            console.error('TTS error:', error);
            button.classList.remove('pronunciation-loading');
            button.innerHTML = '🔊 Listen (TTS)';
            button.style.opacity = '0.5';
            button.disabled = true;
        }
    }
    
    async playAPIAudio(audioUrl, button) {
        button.classList.add('pronunciation-loading');
        button.textContent = '🔊 Playing...';
        
        try {
            const audio = new Audio(audioUrl);
            
            audio.onended = () => {
                button.classList.remove('pronunciation-loading');
                button.innerHTML = '🔊 Listen (API)';
            };
            
            audio.onerror = () => {
                throw new Error('Audio playback failed');
            };
            
            await audio.play();
        } catch (error) {
            console.error('API audio error:', error);
            button.classList.remove('pronunciation-loading');
            button.innerHTML = '🔊 Listen (API)';
            // Fallback to TTS
            this.playWordPronunciation(button.dataset.word, button);
        }
    }
}

// Initialize the app when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PeerlyApp();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        // Pause speech recognition when tab is hidden
        if (window.peerlyApp && window.peerlyApp.recognition) {
            window.peerlyApp.recognition.stop();
        }
    }
});

// Store app instance globally for debugging
window.addEventListener('load', () => {
    if (!window.peerlyApp) {
        window.peerlyApp = new PeerlyApp();
    }
});
