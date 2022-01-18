const app = Vue.createApp({
  data() {
    return {
      identity: "Host",
      isEditing: false,
      state: 0,
      currMonth: 0,
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
      hostMeetingIDs: [2, 3, 20],
      meetingIDs: [2, 6, 8, 29],
      host: [],
      meet: [],
      currentIdx: 0,
    };
  },
  computed: {
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
      for (let i = 1; i <= this.dayOfMonths[this.currMonth]; i++) {
        dateList.push(i);
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
    isHost() {
      return this.identity === "Host";
    },
    isUser() {
      return this.identity === "User";
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
        this.changeState(1);
      }
    },
  },
});

app.mount("#mymeeting");
