
# Winnie_Bot

Winnie is a Discord bot for authors.  Winnie allows users to track goals, challenge each other to word wars and sprints, and get prompts to assist with their writing.

## Adding Winnie to your Discord server

If you want to run Winnie on your server, you can either invite the public Winnie_Bot account or set up your own Discord bot with Winnie's code.

### Inviting the public Winnie_Bot account

If you want to invite the public Winnie_Bot account to your server, go [here](https://discordapp.com/api/oauth2/authorize?client_id=386676183791829002&permissions=0&scope=bot).  If you want to turn off cross-server wars, your admin will need to use the !config command (1.1.3 and later).

### Setting up your own instance of Winnie

#### Requirements

Node.js
npm (Node Package Manager)

#### Installation Instructions

* Clone the Winnie_Bot repository onto your server.
* Run `npm install` to get package dependencies.
* Run tz-script.sh to download the IANA timezone data.
* Run `node main.js` to initialise Winnie.

## Dependencies and frameworks

* [Discord.js](link) - Discord API for Node.js
* [ESLint](link) - Linting
* [node-gameloop](link) - Accurate timer
* [timezone-js](link) - Timezone management
* [winston](link) - Improved logging

## Bug reports

Please report bugs by opening an [issue](https://github.com/RobFaie/Winnie_Bot/issues) on GitHub.

## Contributing to Winnie

We welcome all contributors to Winnie.  Your pull requests will be reviewed by the authors prior to merging.  Please document your code, and play nicely with other contributors.

## Authors

* **Dawn E. Collett** - *Primary Developer* - [GitHub](https://github.com/lisushka)
* **Robert W. McLeod** - *Logging and server assistance* - [GitHub](https://github.com/RobFaie)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details

## Acknowledgments

* Winnie is inspired by Timmy, National Novel Writing Month's IRC bot.  Timmy can be found at https://github.com/utoxin/TimTheWordWarBot.
* Prompts were brainstormed by NaNoWriMo's Australia::Melbourne region.

Winnie's repository is located at https://github.com/RobFaie/Winnie_Bot.