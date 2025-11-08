<div align="center">

# 🎨 Discord Animated Status Selfbot

<img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" />
<img src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" />
<img src="https://img.shields.io/badge/Discord-5865F2?style=for-the-badge&logo=discord&logoColor=white" />
<img src="https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white" />
<img src="https://img.shields.io/badge/License-MIT-yellow.svg" />


**Full-featured animated status selfbot with beautiful Web UI**

[English](README.md) | [Tiếng Việt](README_VI.md)

[Features](#-features) • [Installation](#-installation) • [Usage](#-usage) • [API](#-api) • [FAQ](#-faq)

</div>

---

## ⚠️ Warning

**Using selfbots violates Discord's Terms of Service.** Your account may be banned. Use at your own risk. This project is for educational purposes only.

---

## ✨ Features

### 🎯 Core Features
- 🎨 **Beautiful Web UI** - Modern dark theme with glow effects
- 🔄 **Auto Status Rotation** - Automatically rotate through custom statuses
- 💎 **Custom Emoji Support** - Use emojis from any server you're in
- 💻 **JavaScript Eval** - Dynamic status using code (clock, counters, etc.)
- 🎵 **Lyrics Support** - Perfect for song lyrics rotation
- ⚡ **Real-time Updates** - Live status display in Web UI

### 📦 Management Features
- 💾 **Export/Import** - Share animations between accounts
- 📤 **Bulk Operations** - Export/Import all animations at once
- 📋 **Quick Share** - Copy/Paste animations via clipboard
- 🗂️ **MongoDB Storage** - Persistent animation storage
- 🔧 **Full API** - RESTful API for advanced usage

### 🎨 UI Features
- 🌟 **Glow Effects** - Mouse-tracking glow on cards
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎭 **Smooth Animations** - Beautiful transitions
- 🎨 **Modern Design** - Clean and professional interface

---

## 🚀 Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- Discord user token

### Quick Start

1. **Clone the repository**
- git clone https://github.com/dnaptdpt/discord-animated-status.git
- cd discord-animated-status

2. **Install dependencies**
- npm install

3. **Configure environment**
- cp .env.example .env
-Edit .env with your Discord token

4. **Start MongoDB** (if using local)
- mongod

5. **Run the bot**
- npm start

6. **Open Web UI**
- http://localhost:3000


### Getting Your Discord Token

> ⚠️ **Never share your token with anyone!**

1. Open Discord (Web or Desktop)
2. Press `F12` to open DevTools
3. Go to **Console** tab -> application -> Local storage -> https://discord.com -> Filter ( Token) -> Ctrl + Shift + M
4. Copy the token (keep it secret!)

---

## 🎯 Best Practices

### Safe Usage

1. **Use reasonable intervals**: 5-10 seconds minimum
2. **Don't spam**: Discord has rate limits (~30 changes/minute)
3. **Use a VPN**: Additional privacy layer
4. **Alt account**: Don't use on your main account
5. **Monitor usage**: Check console for any errors

### Performance Tips

1. **Optimize Eval Code**: Keep JavaScript simple and efficient
2. **Frame Count**: 10-30 frames is optimal
3. **Interval**: 5-10 seconds recommended
4. **MongoDB**: Use indexes for faster queries
5. **Browser**: Use Chrome/Edge for best UI experience

---

## 🐛 Troubleshooting

### Bot not connecting
- Check if token is correct in `.env`
- Make sure you're not logged in elsewhere
- Token may have expired - get a new one

### Emojis not loading
- Acc must be in servers with those emojis
- Check if emojis still exist
- Try refreshing the page
- Nitro is required

### Animation not starting
- Ensure at least one frame has text
- Check minimum interval (2900ms)
- Verify MongoDB connection

### Rate Limited
- Increase interval between frames
- Discord limit: ~30 changes per minute
- Use >= 5000ms interval

### Status not showing
- Status only visible to others
- Check from another account
- May take a few seconds to update

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Alex Do**

- GitHub: [@dnaptdpt](https://github.com/dnaptdpt)
- Discord: Alexdo199

---

## 🙏 Acknowledgments

- [discord.js-selfbot-v13](https://github.com/aiko-chan-ai/discord.js-selfbot-v13) - Discord selfbot library
- [Express.js](https://expressjs.com/) - Web framework
- [MongoDB](https://www.mongodb.com/) - Database
- Inspired by [BetterDiscord Animated Status](https://github.com/toluschr/BetterDiscord-Animated-Status)

---

## 🔒 Security

- Never share your token
- Use `.env` for sensitive data
- Don't commit `.env` to git
- Use strong MongoDB password
- Only run on trusted networks

---

## 💡 FAQ

### Is the bot safe?
Using selfbots violates Discord's Terms of Service. Use at your own risk.

### Can I use this on Heroku?
Yes, but requires additional configuration for MongoDB Atlas and environment variables.

### Why doesn't my status show up?
Selfbot status only displays to others, not to yourself.

### What's the minimum interval?
2900ms is safe, but >= 5000ms is recommended to avoid rate limiting.

### Can I import lyrics from a text file?
Not currently, but you can copy-paste or use the JSON import feature.

---

## 📞 Support

If you encounter issues:
1. Read the [Troubleshooting](#-troubleshooting) section
2. Check console for errors
3. Verify MongoDB connection
4. Check your Discord token

---

## 📝 License

This project is licensed under the **MIT License**.

### What does this mean?

✅ **You CAN:**
- Use commercially
- Modify
- Distribute
- Private use

❌ **You CANNOT:**
- Hold liable

⚠️ **You MUST:**
- Include copyright
- Include license

### Full License Text

- MIT License

Copyright (c) 2025 Alex Do

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

See the [LICENSE](LICENSE) file for full details.


<div align="center">

### Made with ❤️ by Alex Do

**⚠️ Remember: Use responsibly and at your own risk!**

[⬆ Back to top](#-discord-animated-status-selfbot)

</div>


