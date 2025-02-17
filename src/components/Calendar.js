import React, { Component } from "react";
import BigCalendar from "react-big-calendar";
import { Chart } from "react-charts";
import moment from "moment";
import Dialog from "material-ui/Dialog";
import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import { ChartComponent } from "./CharComponent";
import TimePicker from "material-ui/TimePicker";
require("react-big-calendar/lib/css/react-big-calendar.css");

BigCalendar.momentLocalizer(moment);

class Calendar extends Component {
  constructor() {
    super();
    this.state = {
      events: [],
      title: "",
      start: "",
      end: "",
      desc: "",
      openSlot: false,
      openEvent: false,
      clickedEvent: {},
      dataone: [
        {
          label: "Event",
          data: [
            [moment(2010, "YYYY"), null],
            [moment(2011, "YYYY"), 3],
            [moment(2012, "YYYY"), 2],
            [moment(2013, "YYYY"), 1],
            [moment(2015, "YYYY"), 3],
            [moment(2016, "YYYY"), null],
          ],
        },
      ],
      options: {
        scales: {
          xAxes: [
            {
              barPercentage: 0.4,
            },
          ],
        },
      },
      series: { type: "bar" },
      axes: [
        { primary: true, type: "time", position: "bottom" },
        { type: "linear", position: "left" },
      ],
    };
    this.handleClose = this.handleClose.bind(this);
  }

  // componentDidMount(){
  //     this.getCachedEvents();
  // }

  // getCachedEvents(){
  //   const cachedEvents = localStorage.getItem("cachedEvents");
  //   console.log("Cached Events", JSON.parse(cachedEvents));
  //   if(cachedEvents){
  //       this.setState({events: JSON.parse(cachedEvents)})
  //   }
  //   return;
  // }

  //closes modals
  handleClose() {
    this.setState({ openEvent: false, openSlot: false });
  }

  //  Allows user to click on calendar slot and handles if appointment exists
  handleSlotSelected(slotInfo) {
    console.log("Real slotInfo", slotInfo);
    this.setState({
      title: "",
      desc: "",
      start: slotInfo.start,
      end: slotInfo.end,
      openSlot: true,
    });
  }

  handleEventSelected(event) {
    console.log("event", event);
    this.setState({
      openEvent: true,
      clickedEvent: event,
      start: event.start,
      end: event.end,
      title: event.title,
      desc: event.desc,
    });
  }

  setTitle(e) {
    this.setState({ title: e });
  }

  setDescription(e) {
    this.setState({ desc: e });
  }

  handleStartTime = (event, date) => {
    this.setState({ start: date });
  };

  handleEndTime = (event, date) => {
    this.setState({ end: date });
  };

  // Onclick callback function that pushes new appointment into events array.
  setNewAppointment() {
    const { start, end, title, desc } = this.state;
    let appointment = { title, start, end, desc };
    let events = this.state.events.slice();
    events.push(appointment);
    // localStorage.setItem("cachedEvents", JSON.stringify(events));
    this.setState({ events });
  }

  //  Updates Existing Appointments Title and/or Description
  updateEvent() {
    const { title, desc, start, end, events, clickedEvent } = this.state;
    const index = events.findIndex((event) => event === clickedEvent);
    const updatedEvent = events.slice();
    updatedEvent[index].title = title;
    updatedEvent[index].desc = desc;
    updatedEvent[index].start = start;
    updatedEvent[index].end = end;
    // localStorage.setItem("cachedEvents", JSON.stringify(updatedEvent));
    this.setState({
      events: updatedEvent,
    });
  }

  //  filters out specific event that is to be deleted and set that variable to state
  deleteEvent() {
    let updatedEvents = this.state.events.filter(
      (event) => event["start"] !== this.state.start
    );
    // localStorage.setItem("cachedEvents", JSON.stringify(updatedEvents));
    this.setState({ events: updatedEvents });
  }

  render() {
    const { dataone, options, series, axes } = this.state;
    console.log("render()");
    const eventActions = [
      <FlatButton
        label="Cancel"
        primary={false}
        keyboardFocused={true}
        onClick={this.handleClose}
      />,
      <FlatButton
        label="Delete"
        secondary={true}
        keyboardFocused={true}
        onClick={() => {
          this.deleteEvent(), this.handleClose();
        }}
      />,
      <FlatButton
        label="Confirm Edit"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
        onClick={() => {
          this.updateEvent(), this.handleClose();
        }}
      />,
    ];
    const appointmentActions = [
      <FlatButton label="Cancel" secondary={true} onClick={this.handleClose} />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={() => {
          this.setNewAppointment(), this.handleClose();
        }}
      />,
    ];

    return (
      <div id="Calendar">
        {/* react-big-calendar library utilized to render calendar*/}
        <BigCalendar
          events={this.state.events}
          views={["month", "week", "day", "agenda"]}
          timeslots={2}
          defaultView="month"
          defaultDate={new Date()}
          selectable={true}
          onSelectEvent={(event) => this.handleEventSelected(event)}
          onSelectSlot={(slotInfo) => this.handleSlotSelected(slotInfo)}
        />

        {/* Material-ui Modal for booking new appointment */}
        <Dialog
          title={`Chart integration example`}
          // actions={appointmentActions}
          modal={false}
          open={this.state.openSlot}
          onRequestClose={this.handleClose}
        >
          {dataone.length > 0 ? (
            <div
              style={{
                width: "800px",
                height: "300px",
              }}
            >
              <Chart
                data={dataone}
                options={options}
                axes={axes}
                series={series}
                tooltip
              />
            </div>
          ) : (
            <div
              style={{
                textAlign: "center",
                padding: "20px",
                fontSize: "16px",
                color: "gray",
              }}
            >
              No data to show
            </div>
          )}
        </Dialog>

        {/* Material-ui Modal for Existing Event */}
        <Dialog
          title={`View/Edit Appointment of ${moment(this.state.start).format(
            "MMMM Do YYYY"
          )}`}
          actions={eventActions}
          modal={false}
          open={this.state.openEvent}
          onRequestClose={this.handleClose}
        ></Dialog>
      </div>
    );
  }
}

export default Calendar;
