const app = Vue.createApp({
  data() {
    return {
      //room
      roomAvailST: 9,
      roomAvailET: 18,
      roomNames: ["RoomA", "RoomB", "RoomC", "RoomD", "RoomE"],
      roomOccupied: [
        [false, false, true, false, false, false, false, false, false],
        [false, false, false, false, true, true, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
        [false, false, false, false, false, false, false, false, false],
      ],

      //user basic profile
      hostEmail: "",
      hostName: "",

      //area for vue
      state: 0,
      startWeekDays: [6, 2, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4],
      dayOfMonths: [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
      monthNames: [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December",
      ],
      currMonth: 0,
      dateSelected: 0,
      invitees: [
        "b108150024@gapps.ntust.edu.tw",
        "b108150066@gapps.ntust.edu.tw",
      ],
      inputInvitee: "",
      meetingName: "",
      startTime: "9",
      endTime: "10",
      roomSelected: "0",
    };
  },
  computed: {
    formattedDate() {
      return (
        "2022/" +
        String(this.currMonth + 1) +
        "/" +
        String(this.dateSelected + 1)
      );
    },
    preDatesList() {
      dateList = [];
      for (let i = 0; i < this.startWeekDays[this.currMonth]; i++) {
        dateList.push("");
      }
      return dateList;
    },
    datesList() {
      dateList = [];
      for (let i = 1; i <= this.dayOfMonths[this.currMonth]; i++) {
        dateList.push(i);
      }
      return dateList;
    },
    postDatesList() {
      dateList = [];
      counter = 0;
      for (let i = 0; i < this.startWeekDays[this.currMonth]; i++) {
        counter++;
      }
      for (let i = 1; i <= this.dayOfMonths[this.currMonth]; i++) {
        counter++;
      }
      offset = counter % 7;
      offset = (7 - offset) % 7;
      for (let i = 0; i < offset; ++i) {
        dateList.push("");
      }
      return dateList;
    },
    monthName() {
      return this.monthNames[this.currMonth];
    },
    isShowCalendar() {
      return this.state === 0;
    },
    isShowDateInfo() {
      return this.state === 1;
    },
    isShowRoomView() {
      return this.state === 2;
    },
    isShowBookPage() {
      return this.state === 3;
    },
  },
  methods: {
    changeState(value) {
      this.state = value;
    },
    addNewInvitee() {
      if (this.inputInvitee === "") return;
      if (this.inputInvitee === this.hostEmail) {
        alert("You cannot invite yourself!");
        return;
      }
      for (var i in this.invitees) {
        if (this.inputInvitee === this.invitees[i]) {
          alert(this.inputInvitee + " has already been invited!");
          return;
        }
      }
      var xhr = new XMLHttpRequest();
      valid = true;
      xhr.open("GET", "/api/profiles/" + this.inputInvitee, false);
      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 404 || this.status === 500) {
            alert("This email is not valid");
            valid = false;
          }
        }
      };
      xhr.send();
      if (!valid) return;
      this.invitees.push(this.inputInvitee);
      this.inputInvitee = "";
    },
    removeInvitee(index) {
      this.invitees.splice(index, 1);
    },
    addMonth() {
      if (this.currMonth < 11) {
        this.currMonth++;
      }
    },
    decMonth() {
      if (this.currMonth > 0) {
        this.currMonth--;
      }
    },
    onDateClick(index) {
      if (index >= 0 && index < this.dayOfMonths[this.currMonth]) {
        this.dateSelected = index;
        this.refreshRoomAvail();
        this.changeState(1);
      }
    },
    refreshRoomAvail() {
      var comp = this;
      var xhr = new XMLHttpRequest();
      var url = "/api/meetings/" + this.currMonth + "/" + this.dateSelected;
      xhr.open("GET", url, false);
      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            const result = JSON.parse(this.responseText);
            for (var i = comp.roomAvailST; i < comp.roomAvailET; i++) {
              for (var j = 0; j < 5; j++) {
                comp.roomOccupied[j][i - comp.roomAvailST] = false;
              }
            }
            for (var i = 0; i < result.length; i++) {
              var obj = result[i];
              const roomId = parseInt(result[i].roomID);
              for (var t = obj.startTime; t < obj.endTime; t++) {
                comp.roomOccupied[roomId][t - comp.roomAvailST] = true;
              }
            }
          } else {
            console.log(this.status, this.statusText);
          }
        }
      };
      xhr.send();
    },
    reserveMeeting() {
      st = parseInt(this.startTime);
      et = parseInt(this.endTime);
      if (st >= et) {
        alert("Invalid start time and end time!");
        return;
      }
      if (
        this.hostName === "" ||
        this.meetingName === "" ||
        this.roomSelected === "" ||
        this.invitees.length < 1
      ) {
        alert("Incomplete info!");
        return;
      }
      var conflict = false;
      const roomId = parseInt(this.roomSelected);
      for (var t = st; t < et; t++) {
        if (this.roomOccupied[roomId][t - this.roomAvailST]) {
          conflict = true;
          break;
        }
      }
      if (conflict) {
        alert("Meeting room is already booked by others!");
        return;
      }
      //send request
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/createMeeting");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = () => {
        const DONE = 4;
        const CREATED = 201;
        if (xhr.readyState === DONE) {
          if (xhr.status === CREATED || xhr.status === 200) {
            //this.response = xhr.response;
            console.log(xhr.response);
            alert("successfully booked!");
            window.location.href = "/calendar";
          } else {
            this.response = "Error: " + xhr.status;
          }
        }
      };
      xhr.send(
        JSON.stringify({
          hostEmail: this.hostEmail,
          hostName: this.hostName,
          name: this.meetingName,
          roomID: this.roomSelected,
          month: this.currMonth,
          day: this.dateSelected,
          startTime: st,
          endTime: et,
          description: "description area",
          attendeeEmails: this.invitees,
        })
      );
    },
    loadProfile() {
      var comp = this;
      var xhr = new XMLHttpRequest();
      var url = "/info/userProfile";
      xhr.open("GET", url, false);
      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            const result = JSON.parse(this.responseText);
            console.log(result);
            comp.hostEmail = result.email;
            comp.hostName = result.name;
          } else {
            console.log(this.status, this.statusText);
          }
        }
      };
      xhr.send();
    },
  },
  mounted() {
    this.loadProfile();
  },
});

app.mount("#calendar");
