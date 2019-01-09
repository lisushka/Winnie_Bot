const clist = require('./clist.js');
const config = require('../config.json');
const conn = require('mongoose').connection;

/** Represents a challenge. */
class Challenge {
  /**
   * Create a challenge.
   * @param {Number} objectID - The unique ID of the challenge.
   * @param {Number} creator - The Discord ID of the creator.
   * @param {String} displayName - The name of the challenge.
   * @param {Number} initStamp - UNIX timestamp of creation time.
   * @param {Number} countdown - Time in minutes from creation to start.
   * @param {Number} duration - Duration in minutes.
   * @param {String} channel - Discord ID of start channel.
   * @param {String} type - The type of challenge that this object represents.
   * @param {Boolean} hidden - Flag for whether challenge is visible to users
   *  on other servers.
   * @param {Array} hookedChannels - A list of channels that have joined the
   *  challenge.
   * @param {Object} joined - A list of users who have joined the
   *  challenge.
   */
  constructor(
      objectID,
      creator,
      displayName,
      initStamp,
      countdown,
      duration,
      channel,
      type,
      hidden,
      hookedChannels,
      joined
  ) {
    this.objectID = objectID;
    this.creator = creator;
    this.displayName = displayName;
    this.initStamp = initStamp;
    this.countdown = countdown;
    this.duration = duration;
    this.channelID = channel;
    this.channel = client.channels.get(this.channelID);
    this.type = type;
    this.joined = joined;
    this.hookedChannels = hookedChannels;
    this.state = 0;
    this.hidden = hidden;

    this.cStart = this.countdown * 60;
    this.cDur = this.duration * 60;
    this.cPost = clist.DUR_AFTER;

    this.startStamp = this.initStamp + this.cStart * 1000;
    this.endStamp = this.startStamp + this.cDur * 1000;
    this.delStamp = this.endStamp + this.cPost * 1000;

    const dateCheck = new Date().getTime();
    if (!(this.startStamp < dateCheck)) {
      this.state = 0;
      this.cStart = Math.ceil((this.startStamp - dateCheck) / 1000);
    } else if (!(this.endStamp < dateCheck)) {
      this.state = 1;
      this.cDur = Math.ceil((this.endStamp - dateCheck) / 1000);
    } else if (!(this.delStamp < dateCheck)) {
      this.state = 2;
      this.cPost = Math.ceil((this.delStamp - dateCheck) / 1000);
    } else {
      this.state = 2;
      this.cPost = 0;
    }
    if (this.state == 0 && this.cStart == this.countdown * 60) {
      let time = 'minute';
      if (this.countdown != 1) {
        time += 's';
      }
      for (let i = 0; i < this.hookedChannels.length; i++) {
        client.channels.get(this.hookedChannels[i]).send(
            'Your ' +
            type +
            ', ' +
            this.displayName +
            ' (ID ' +
            this.objectID +
            '), starts in ' +
            this.countdown +
            time +
            '.'
        );
      }
    }
  }
  /** Update the challenge at each tick. */
  update() {
    switch (this.state) {
      case 0:
        this.start();
        break;
      case 1:
        this.end();
        break;
      case 2:
        this.terminate();
        break;
      default:
        this.channel.send('**Error:** Invalid state reached.');
        delete clist.running[this.objectID];
        break;
    }
  }
  /** Check to see whether the countdown is over, and start the challenge
   * if so.
   */
  start() {
    if (this.cStart > 0) {
      this.cStart--;
    }
    if (this.cStart == 0) {
      this.startMsg();
    } else if (this.cStart == 60) {
      this.sendMsg(this.displayName + ' starts in 1 minute.');
    } else if (this.cStart % 300 == 0) {
      this.sendMsg(
          this.displayName + ' starts in ' +
          this.cStart / 60 + ' minutes.'
      );
    } else if ([30, 10, 5].includes(this.cStart)) {
      this.sendMsg(
          this.displayName + ' starts in ' +
          this.cStart + ' seconds.'
      );
    }
  }
  /** Construct the message displayed to users when a challenge begins. */
  startMsg() {
    for (let i = 0; i < this.hookedChannels.length; i++) {
      const userList = this.getUsers(this.hookedChannels[i]);
      const channelObject = client.channels.get(this.hookedChannels[i]);
      let timeString = 'minutes';
      if (this.duration == 1) {
        timeString = 'minute';
      }
      channelObject.send(
          this.displayName +
          ' (ID ' +
          this.objectID +
          ', ' +
          this.duration +
          ' ' +
          timeString +
          ') starts now!'+
          userList
      );
    }
    this.state = 1;
  }
  /** Check to see whether the challenge is over, and end it if so. */
  end() {
    this.cDur--;
    if (this.cDur <= 0) {
      for (let i = 0; i < this.hookedChannels.length; i++) {
        const userList = this.getUsers(this.hookedChannels[i]);
        const channelObject = client.channels.get(this.hookedChannels[i]);
        let prefix = config.cmd_prefix['default'];
        if (config.cmd_prefix[channelObject.guild.id]) {
          prefix = config.cmd_prefix[channelObject.guild.id];
        }
        channelObject.send(
            this.displayName +
            ' (ID ' +
            this.objectID +
            ') has ended! Post your total using `' +
            prefix +
            'total ' +
            this.objectID +
            ' <total>` to be included in the summary.' +
            userList
        );
      }
      this.state = 2;
    } else if (this.cDur == 60) {
      this.sendMsg('There is 1 minute remaining in ' + this.displayName + '.');
    } else if (this.cDur % 300 == 0) {
      this.sendMsg(
          'There are ' + this.cDur / 60 + ' minutes remaining in ' +
          this.displayName + '.'
      );
    } else if ([30, 10, 5].includes(this.cDur)) {
      this.sendMsg(
          'There are ' + this.cDur + ' seconds remaining in ' +
          this.displayName + '.'
      );
    }
  }
  /** Check to see whether the total period is over, and post the summary. */
  terminate() {
    this.cPost--;
    if (this.cPost <= 0) {
      for (let i = 0; i < this.hookedChannels.length; i++) {
        client.channels
            .get(this.hookedChannels[i])
            .send(clist
                .generateSummary(this.hookedChannels[i], this.objectID));
      }
      conn.collection('challengeDB').remove({_id: this.objectID});
      delete clist.running[this.objectID];
    }
  }
  /** Get all users hooked from a channel.
   * @param {String} channel - The Discord ID of the channel.
   * @return {String} - A list of user snowflakes.
   */
  getUsers(channel) {
    let userList = '';
    for (const user in this.joined) {
      if (this.joined[user].channelID == channel) {
        userList += ' ' + client.users.get(user);
      }
    }
    return userList;
  }
  /** Send a message to all hooked channels.
   * @param {String} msg - The message to send.
   */
  sendMsg(msg) {
    for (let i = 0; i < this.hookedChannels.length; i++) {
      client.channels.get(this.hookedChannels[i]).send(msg);
    }
  }
}

module.exports = Challenge;
