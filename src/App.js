import SockJS from "sockjs-client";
import { Stomp } from "@stomp/stompjs";
import { useEffect, useState } from "react";
import ComboBox from "./auto";
import { TextField } from "@mui/material";
import { DesktopTimePicker } from "@mui/x-date-pickers/DesktopTimePicker";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { renderTimeViewClock } from "@mui/x-date-pickers";

function App() {
  const [connected, setConnected] = useState(false);
  const [greeting, setGreeting] = useState({});
  const body = {
    userId: 1,
    event: {
      id: 1,
      name: "hello world",
    },
  };
  const connectWebSocket = () => {
    const socket = new SockJS("https://facf-62-173-45-238.ngrok-free.app/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect(
      {},
      () => {
        setConnected(true);
        stompClient.subscribe("/topic/event/status", (message) => {
          console.log(JSON.parse(message.body));
          setGreeting(JSON.parse(message.body));
        });
        stompClient.send("/app/message", {}, body);
      },
      (error) => {
        console.log("Error:", error);
      }
    );
  };

  useEffect(() => {
    connectWebSocket();
  });

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <div
        className="App"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border: "1px solid black",
          height: "100vh",
        }}
      >
        {connected ? (
          <>
            <div
              style={{
                background: "black",
                height: "50px",
                color: "white",
                fontWeight: "bolder",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Connected! Greeting: {greeting.userId}
            </div>
            <ComboBox />
            <TextField />

            <DesktopTimePicker
              disableOpenPicker={false}
              // id={id}
              viewRenderers={{
                hours: renderTimeViewClock,
                minutes: renderTimeViewClock,
                seconds: renderTimeViewClock,
              }}
            />
            <DatePicker />
          </>
        ) : (
          <div>
            {/* <DesktopDatePicker/> */}
            <div
              style={{
                background: "black",
                width: "200px",
                height: "50px",
                color: "white",
                fontWeight: "bolder",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              Connecting...
            </div>
            <button
              onClick={connectWebSocket}
              style={{
                background: "black",
                width: "200px",
                height: "150px",
                color: "white",
                fontWeight: "bolder",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                marginTop: "10px",
                borderRadius: "20px",
              }}
            >
              Connect
            </button>
          </div>
        )}
      </div>
    </LocalizationProvider>
  );
}

export default App;
