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
      invitees: [
        "Tommy_example1@gamil.com",
        "John_example2@gamil.com",
        "Kris_example4@gamil.com",
        "Jess_example1@gamil.com",
        "haha_example2@gamil.com",
        "Kiki_example4@gamil.com",
      ],
      inputInvitee: "",
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
      if (this.inputInvitee === "") return;
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
        this.changeState(1);
      }
    },
  },
});

app.mount("#calendar");
