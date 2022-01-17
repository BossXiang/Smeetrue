const app = Vue.createApp({
  data() {
    return {
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
      invitees: [],
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
      alert("test");
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
      if (index > 0 && index <= this.dayOfMonths[this.currMonth]) {
        this.changeState(1);
      }
    },
  },
});

app.mount("#calendar");
