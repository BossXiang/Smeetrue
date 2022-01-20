const app = Vue.createApp({
  data() {
    return {
      //fixed area
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

      //vue properties
      isHost: false,
      hostEmail: "",
      isEditing: false,
      isShowPopUpMsg: false,
      state: 0,
      currMonth: 0,
      dateSelected: 0,
      inputInvitee: "",
      emailContent:
        "[Template] It's very nice to have you here in the meeting. There are a few things you need to know before the meeting!! 1. Bring the laptop   2. Please dress up",

      hostMeetingIDs: [2, 3, 20],
      meetingIDs: [2, 6, 8, 29],
      host: [],
      meet: [],
      currentIdx: 0,

      listMeetings: [],
      listMeetingIds: [],
      listMeetingId: "0",

      //view meeting props
      hostName: "",
      meetingName: "",
      startTime: "9",
      endTime: "10",
      participants: [],
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
      this.host = [];
      this.meet = [];
      for (let i = 0; i < this.dayOfMonths[this.currMonth]; i++) {
        dateList.push(i + 1);
        this.host.push(this.hostMeetingIDs.indexOf(i) != -1);
        this.meet.push(this.meetingIDs.indexOf(i) != -1);
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
    isShowMeetingList() {
      return this.state === 1;
    },
    isShowMeetingInfo() {
      return this.state === 2;
    },
    isShowEmailBox() {
      return this.state === 3;
    },
    textColor() {
      if (this.isEditing) return "white";
      else return "#CCC";
    },
  },
  methods: {
    changeState(value) {
      this.state = value;
    },
    viewMeetings(date) {
      this.currentIdx = date;
      this.changeState(1);
    },
    setEditMode(value) {
      this.isEditing = value;
    },
    popupMsg(value) {
      this.isShowPopUpMsg = value;
    },
    addNewPar() {
      if (this.inputInvitee === "") return;
      if (this.inputInvitee === this.hostEmail) {
        alert("You cannot invite yourself!");
        return;
      }
      if (this.participants.includes(this.inputInvitee)) {
        alert(this.inputInvitee + " has already been invited!");
        return;
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
      this.participants.push(this.inputInvitee);
      this.inputInvitee = "";
    },
    removePar(index) {
      this.participants.splice(index, 1);
    },
    addMonth() {
      if (this.currMonth < 11) {
        this.currMonth++;
        this.refreshMeetingTable();
      }
    },
    decMonth() {
      if (this.currMonth > 0) {
        this.currMonth--;
        this.refreshMeetingTable();
      }
    },
    onDateClick(index) {
      if (index >= 0 && index < this.dayOfMonths[this.currMonth]) {
        this.dateSelected = index;
        this.updateListMeetings();
        this.changeState(1);
      }
    },
    onListMeetingClick(index) {
      this.loadMeetingInfo(index);
      this.changeState(2);
    },
    refreshMeetingInfo() {
      var comp = this;
      var xhr = new XMLHttpRequest();
      var url = "/api/meeting/" + this.listMeetingId;
      xhr.open("GET", url, false);
      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            const result = JSON.parse(this.responseText)[0];
            comp.isHost = result.hostEmail === comp.hostEmail;
            comp.hostName = result.hostName;
            comp.meetingName = result.name;
            comp.startTime = result.startTime.toString();
            comp.endTime = result.endTime.toString();
            comp.participants = result.attendeeEmails;
          } else {
            console.log(this.status, this.statusText);
          }
        }
      };
      xhr.send();
    },
    loadMeetingInfo(index) {
      this.listMeetingId = this.listMeetingIds[index];
      var comp = this;
      var xhr = new XMLHttpRequest();
      var url = "/api/meeting/" + this.listMeetingId;
      xhr.open("GET", url, false);
      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            const result = JSON.parse(this.responseText)[0];
            comp.isHost = result.hostEmail === comp.hostEmail;
            comp.hostName = result.hostName;
            comp.meetingName = result.name;
            comp.startTime = result.startTime.toString();
            comp.endTime = result.endTime.toString();
            comp.participants = result.attendeeEmails;
          } else {
            console.log(this.status, this.statusText);
          }
        }
      };
      xhr.send();
    },
    saveMeetingInfo() {
      if (
        this.meetingName === "" ||
        this.hostName === "" ||
        this.participants.length < 1
      ) {
        alert("Incomplete information!");
        return;
      }
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/updateMeeting");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = () => {
        const DONE = 4;
        const CREATED = 201;
        if (xhr.readyState === DONE) {
          if (xhr.status === CREATED || xhr.status === 200) {
            //this.response = xhr.response;
            console.log(xhr.response);
          } else {
            this.response = "Error: " + xhr.status;
          }
        }
      };
      var st = parseInt(this.startTime);
      var et = parseInt(this.endTime);
      xhr.send(
        JSON.stringify({
          _id: this.listMeetingId,
          name: this.meetingName,
          hostName: this.hostName,
          startTime: st,
          endTime: et,
          attendeeEmails: this.participants,
        })
      );
    },
    updateListMeetings() {
      this.listMeetingIds = [];
      this.listMeetings = [];
      var comp = this;
      var xhr = new XMLHttpRequest();
      var url =
        "/api/getMeetings/" +
        this.currMonth +
        "/" +
        this.dateSelected +
        "/" +
        this.hostEmail;
      xhr.open("GET", url, false);
      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            const result = JSON.parse(this.responseText);
            for (var i = 0; i < result.length; i++) {
              var obj = result[i];
              comp.listMeetingIds.push(obj._id);
              comp.listMeetings.push(obj.name);
            }
          } else {
            console.log(this.status, this.statusText);
          }
        }
      };
      console.log(comp.listMeetingIds);
      xhr.send();
    },
    refreshMeetingTable() {
      this.hostMeetingIDs = [];
      this.meetingIDs = [];
      var comp = this;
      var xhr = new XMLHttpRequest();
      var url = "/api/getMeetings/" + this.currMonth + "/" + this.hostEmail;
      xhr.open("GET", url, false);
      xhr.onreadystatechange = function () {
        if (this.readyState === XMLHttpRequest.DONE) {
          if (this.status === 200) {
            const result = JSON.parse(this.responseText);
            for (var i = 0; i < result.length; i++) {
              var obj = result[i];
              if (obj.hostEmail == comp.hostEmail) {
                if (comp.hostMeetingIDs.includes(obj.day) === false) {
                  comp.hostMeetingIDs.push(obj.day);
                }
              } else {
                if (comp.meetingIDs.includes(obj.day) === false) {
                  comp.meetingIDs.push(obj.day);
                }
              }
            }
          } else {
            console.log(this.status, this.statusText);
          }
        }
      };
      xhr.send();
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
          } else {
            console.log(this.status, this.statusText);
          }
        }
      };
      xhr.send();
    },
    onSaveBtnClick() {
      this.saveMeetingInfo();
      this.setEditMode(false);
    },
    onBackBtnClick() {
      this.refreshMeetingInfo();
      this.setEditMode(false);
    },
    cancelMeeting() {
      const xhr = new XMLHttpRequest();
      xhr.open("DELETE", "/api/deleteMeeting/" + this.listMeetingId);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = () => {
        const DONE = 4;
        const CREATED = 201;
        if (xhr.readyState === DONE) {
          if (xhr.status === CREATED || xhr.status === 200) {
            console.log(xhr.response);
            alert("Successfully canceled the meeting!");
            window.location.href = "/mymeeting";
          } else {
            this.response = "Error: " + xhr.status;
          }
        }
      };
      xhr.send();
      this.isShowPopUpMsg = false;
    },
    sendEmail() {
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/sendEmail");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onreadystatechange = () => {
        const DONE = 4;
        const CREATED = 201;
        if (xhr.readyState === DONE) {
          if (xhr.status === CREATED || xhr.status === 200) {
            //this.response = xhr.response;
            console.log(xhr.response);
            alert("message successfully sent!");
            window.location.href = "/mymeeting";
          } else {
            this.response = "Error: " + xhr.status;
            window.location.href = "/mymeeting";
          }
        }
      };
      xhr.send(
        JSON.stringify({
          id: this.listMeetingId,
          text: this.emailContent,
        })
      );
    },
  },
  mounted() {
    this.loadProfile();
    this.refreshMeetingTable();
  },
});

app.mount("#mymeeting");
