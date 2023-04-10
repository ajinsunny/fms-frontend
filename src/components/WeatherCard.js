import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBRow,
} from "mdb-react-ui-kit";

import "./WeatherCard.css";

function WeatherCard() {
  const [weatherData, setWeatherData] = useState(null);
  const apiKey = process.env.REACT_APP_WEATHER_API_KEY;

  useEffect(() => {
    async function fetchWeatherData() {
      try {
        const permission = await navigator.permissions.query({
          name: "geolocation",
        });

        if (permission.state === "granted" || permission.state === "prompt") {
          navigator.geolocation.getCurrentPosition(
            async (position) => {
              const { latitude, longitude } = position.coords;
              const response = await axios.get(
                `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=imperial`
              );

              setWeatherData(response.data);
            },
            (error) => {
              console.error("Error fetching location:", error);
            }
          );
        } else {
          console.error("Geolocation permission denied");
        }
      } catch (error) {
        console.error("Error checking geolocation permission:", error);
      }
    }

    fetchWeatherData();
  }, []);

  // const { main, name, sys, weather } = weatherData;
  // const temperature = Math.round(main.temp);

  return (
    <div className="weather-card-wrapper">
      {!weatherData ? (
        <p style={{ justifyContent: "right" }}>Loading weather data...</p>
      ) : (
        (() => {
          const { main, name, sys, weather } = weatherData;
          const temperature = Math.round(main.temp);

          return (
            <section style={{ backgroundColor: "#222222" }}>
              <MDBContainer className="h-100">
                <MDBRow
                  className="justify-content-center align-items-center h-100"
                  style={{ color: "#282828" }}
                >
                  <MDBCol>
                    <MDBCard
                      className="mb-4 gradient-custom custom-card"
                      style={{ borderRadius: "25px" }}
                    >
                      <MDBCardBody className="p-4">
                        <div className="d-flex justify-content-between">
                          <div>
                            <h5 className="display-2 temp-text mt-4 pt-3">
                              <strong>{temperature}°F</strong>
                            </h5>

                            <p className="text-white ">
                              {name}, {sys.country}
                            </p>
                          </div>
                          <div>
                            <img
                              src={`http://openweathermap.org/img/wn/${weather[0].icon}@4x.png`}
                              alt={weather[0].description}
                              width="150px"
                            />
                          </div>
                        </div>
                      </MDBCardBody>
                    </MDBCard>
                  </MDBCol>
                </MDBRow>
              </MDBContainer>
            </section>
          );
        })()
      )}
    </div>
  );
}

export default WeatherCard;
