import { useEffect, useMemo, useState } from "react";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { createBooking, getAllEquipment } from "../../services/api";
import BookingSuccessModal from "../BookingSuccessModal/BookingSuccessModal";
import "./BookingModal.css";

const MINUTE_STEP = 15;
const MINUTES_IN_DAY = 24 * 60;
const MINUTE_OPTIONS = ["00", "15", "30", "45"];
const HOUR_12_OPTIONS = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "11",
  "12",
];
const AMPM_OPTIONS = ["AM", "PM"];

const pad2 = (value) => String(value).padStart(2, "0");

const toLocalDateInputValue = (date) => {
  const year = date.getFullYear();
  const month = pad2(date.getMonth() + 1);
  const day = pad2(date.getDate());
  return `${year}-${month}-${day}`;
};

const ceilNowToStepTotalMinutes = (stepMinutes) => {
  const now = new Date();
  const currentTotalMinutes = now.getHours() * 60 + now.getMinutes();
  const snappedTotalMinutes =
    Math.ceil(currentTotalMinutes / stepMinutes) * stepMinutes;
  if (snappedTotalMinutes >= MINUTES_IN_DAY) return null;
  return snappedTotalMinutes;
};

const toTime24StringFromTotalMinutes = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${pad2(hours)}:${pad2(minutes)}`;
};

const fromTotalMinutesToParts = (totalMinutes) => {
  const hours24 = Math.floor(totalMinutes / 60) % 24;
  const minutes = totalMinutes % 60;

  const ampm = hours24 >= 12 ? "PM" : "AM";
  let hour12 = hours24 % 12;
  if (hour12 === 0) hour12 = 12;
  return {
    hour12: String(hour12),
    minute: pad2(minutes),
    ampm,
  };
};

const toTotalMinutesFromParts = ({ hour12, minute, ampm }) => {
  if (!hour12 || !minute || !ampm) return null;

  const hour12Num = parseInt(hour12, 10);
  const minuteNum = parseInt(minute, 10);
  if (Number.isNaN(hour12Num) || Number.isNaN(minuteNum)) return null;

  const base = hour12Num % 12;
  const hour24 = ampm === "PM" ? base + 12 : base;
  return hour24 * 60 + minuteNum;
};

const buildAllowedTotals = (minTotalMinutes, stepMinutes) => {
  if (minTotalMinutes == null) return [];
  const results = [];
  for (
    let total = minTotalMinutes;
    total < MINUTES_IN_DAY;
    total += stepMinutes
  ) {
    results.push(total);
  }
  return results;
};

const firstAllowedAtOrAfter = (allowedTotals, candidateTotal) => {
  if (!allowedTotals.length) return null;
  if (candidateTotal == null) return allowedTotals[0];

  for (const total of allowedTotals) {
    if (total >= candidateTotal) return total;
  }
  return null;
};

const BookingModal = ({ game, location, userId, onClose, onSuccess }) => {
  const todayDate = useMemo(() => toLocalDateInputValue(new Date()), []);
  const [bookingDate, setBookingDate] = useState(todayDate);
  const [startTotalMinutes, setStartTotalMinutes] = useState(null);
  const [endTotalMinutes, setEndTotalMinutes] = useState(null);
  const [submittedSchedule, setSubmittedSchedule] = useState(null);
  const [error, setError] = useState("");
  const [playerIds, setPlayerIds] = useState(() => {
    const initial = Array(game.numberOfPlayers).fill("");
    if (userId != null && userId !== "") {
      initial[0] = String(userId);
    }
    return initial;
  });
  const [selectedEquipmentId, setSelectedEquipmentId] = useState("");
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [bookingDetails, setBookingDetails] = useState(null);

  const { data: equipmentData } = useQuery({
    queryKey: ["equipment"],
    queryFn: getAllEquipment,
  });

  // Ensure equipmentList is always an array
  const equipmentList = Array.isArray(equipmentData) ? equipmentData : [];

  const queryClient = useQueryClient();

  const bookingMutation = useMutation({
    mutationFn: createBooking,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      console.log("Booking success - game data:", game);
      console.log("Game floor:", game?.gameFloor);

      const startTime =
        submittedSchedule?.startTime ||
        (bookingDate && startTotalMinutes != null
          ? `${bookingDate}T${toTime24StringFromTotalMinutes(startTotalMinutes)}`
          : "");
      const endTime =
        submittedSchedule?.endTime ||
        (bookingDate && endTotalMinutes != null
          ? `${bookingDate}T${toTime24StringFromTotalMinutes(endTotalMinutes)}`
          : "");

      setBookingDetails({
        bookingId: data.bookingId,
        gameName: game?.gameName,
        floor: game?.gameFloor,
        startTime: startTime,
        endTime: endTime,
        equipment: selectedEquipmentId,
      });
      setShowSuccessModal(true);
      // Don't close immediately, let success modal handle it
      if (onSuccess) {
        onSuccess();
      }
    },
    onError: (err) => {
      setError(
        err.response?.data?.message ||
          "Failed to create booking. Please try again.",
      );
    },
  });

  const handlePlayerIdChange = (index, value) => {
    const newPlayerIds = [...playerIds];
    newPlayerIds[index] = value;
    setPlayerIds(newPlayerIds);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const startTime =
      bookingDate && startTotalMinutes != null
        ? `${bookingDate}T${toTime24StringFromTotalMinutes(startTotalMinutes)}`
        : "";
    const endTime =
      bookingDate && endTotalMinutes != null
        ? `${bookingDate}T${toTime24StringFromTotalMinutes(endTotalMinutes)}`
        : "";

    if (!bookingDate) {
      setError("Please select a booking date");
      return;
    }

    if (startTotalMinutes == null || endTotalMinutes == null) {
      setError("Please select both start and end times");
      return;
    }

    if (new Date(startTime) >= new Date(endTime)) {
      setError("End time must be after start time");
      return;
    }

    if (playerIds.some((id) => !id)) {
      setError("Please enter all player IDs");
      return;
    }

    if (!selectedEquipmentId) {
      setError("Please select equipment");
      return;
    }

    setSubmittedSchedule({ startTime, endTime });
    bookingMutation.mutate({
      userId: parseInt(userId),
      gameId: game.gameId,
      playerIds: playerIds.map((id) => parseInt(id)),
      equipmentId: parseInt(selectedEquipmentId),
      locationId: location?.locationId?.toString(), // Ensure string if backend expects string, but consistent with requested JSON
      bookingStartTime: startTime,
      bookingEndTime: endTime,
    });
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    onClose();
  };

  const minStartTotalMinutes = useMemo(() => {
    if (!bookingDate) return null;
    const isToday = bookingDate === todayDate;
    return isToday ? ceilNowToStepTotalMinutes(MINUTE_STEP) : 0;
  }, [bookingDate, todayDate]);

  const startAllowedTotals = useMemo(
    () => buildAllowedTotals(minStartTotalMinutes, MINUTE_STEP),
    [minStartTotalMinutes],
  );

  const minEndTotalMinutes = useMemo(() => {
    if (startTotalMinutes == null) return null;
    const base = startTotalMinutes + MINUTE_STEP;
    if (minStartTotalMinutes == null) return base;
    return Math.max(base, minStartTotalMinutes + MINUTE_STEP);
  }, [minStartTotalMinutes, startTotalMinutes]);

  const endAllowedTotals = useMemo(
    () => buildAllowedTotals(minEndTotalMinutes, MINUTE_STEP),
    [minEndTotalMinutes],
  );

  useEffect(() => {
    if (minStartTotalMinutes == null) {
      setStartTotalMinutes(null);
      setEndTotalMinutes(null);
      return;
    }

    const defaultStart = firstAllowedAtOrAfter(
      startAllowedTotals,
      minStartTotalMinutes,
    );
    setStartTotalMinutes(defaultStart);

    const preferredEnd = defaultStart != null ? defaultStart + 60 : null;
    const minEnd = defaultStart != null ? defaultStart + MINUTE_STEP : null;
    const endCandidate =
      preferredEnd != null && preferredEnd < MINUTES_IN_DAY
        ? preferredEnd
        : minEnd;

    const nextEndAllowed = firstAllowedAtOrAfter(
      buildAllowedTotals(endCandidate, MINUTE_STEP),
      endCandidate,
    );
    setEndTotalMinutes(nextEndAllowed);
  }, [bookingDate, minStartTotalMinutes]);

  useEffect(() => {
    if (startTotalMinutes == null) {
      setEndTotalMinutes(null);
      return;
    }
    if (minEndTotalMinutes == null) return;

    if (endTotalMinutes == null || endTotalMinutes < minEndTotalMinutes) {
      const preferredEnd = startTotalMinutes + 60;
      const endCandidate =
        preferredEnd < MINUTES_IN_DAY ? preferredEnd : minEndTotalMinutes;

      const next = firstAllowedAtOrAfter(endAllowedTotals, endCandidate);
      setEndTotalMinutes(next);
    }
  }, [
    endAllowedTotals,
    endTotalMinutes,
    minEndTotalMinutes,
    startTotalMinutes,
  ]);

  useEffect(() => {
    setPlayerIds((prev) => {
      const count = game.numberOfPlayers;
      const next = Array.from(
        { length: count },
        (_, index) => prev?.[index] ?? "",
      );
      if (userId != null && userId !== "") {
        next[0] = String(userId);
      }
      return next;
    });
  }, [game.numberOfPlayers, userId]);

  return (
    <>
      {!showSuccessModal ? (
        <div className="booking-modal-overlay" onClick={onClose}>
          <div className="booking-modal" onClick={(e) => e.stopPropagation()}>
            <div className="booking-modal-header">
              <h2>Book {game.gameName}</h2>
              <button className="booking-modal-close" onClick={onClose}>
                ×
              </button>
            </div>

            <form className="booking-form" onSubmit={handleSubmit}>
              <div className="booking-info">
                <p>
                  <strong>Location:</strong> {location?.office},{" "}
                  {location?.city}
                </p>
                <p>
                  <strong>Players Required:</strong> {game.numberOfPlayers}
                </p>
              </div>

              <div className="booking-section">
                <h3>Player Details</h3>
                {playerIds.map((_, index) => (
                  <div key={index} className="booking-field">
                    <label>Player {index + 1} ID</label>
                    <input
                      className="player-id-input"
                      type="number"
                      value={playerIds[index]}
                      disabled={index === 0 && userId != null && userId !== ""}
                      readOnly={index === 0 && userId != null && userId !== ""}
                      onChange={(e) =>
                        handlePlayerIdChange(index, e.target.value)
                      }
                      placeholder={`Enter User ID for Player ${index + 1}`}
                      required
                    />
                  </div>
                ))}
              </div>

              <div className="booking-section">
                <h3>Equipment</h3>
                <div className="booking-field">
                  <label>Select Equipment</label>
                  <select
                    value={selectedEquipmentId}
                    onChange={(e) => setSelectedEquipmentId(e.target.value)}
                    required
                  >
                    <option value="">Select Equipment</option>
                    {equipmentList.map((eq) => (
                      <option key={eq.equipmentId} value={eq.equipmentId}>
                        {eq.equipmentName} ({eq.stockAvailable} available)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="booking-field">
                <label htmlFor="bookingDate">Date</label>
                <input
                  type="date"
                  id="bookingDate"
                  value={bookingDate}
                  min={todayDate}
                  onChange={(e) => {
                    const nextDate = e.target.value;
                    setBookingDate(nextDate);
                    setStartTotalMinutes(null);
                    setEndTotalMinutes(null);
                  }}
                  required
                />
              </div>

              <div className="booking-section">
                <h3>Schedule</h3>
                <div className="booking-field">
                  <label htmlFor="startTime">Start Time</label>
                  <div
                    className="time-selectors"
                    aria-label="Start time selectors"
                  >
                    {(() => {
                      const parts =
                        startTotalMinutes != null
                          ? fromTotalMinutesToParts(startTotalMinutes)
                          : { hour12: "", minute: "", ampm: "" };

                      const allowedAmpm = new Set(
                        startAllowedTotals.map(
                          (t) => fromTotalMinutesToParts(t).ampm,
                        ),
                      );
                      const allowedHoursForAmpm = new Set(
                        startAllowedTotals
                          .filter(
                            (t) =>
                              fromTotalMinutesToParts(t).ampm === parts.ampm,
                          )
                          .map((t) => fromTotalMinutesToParts(t).hour12),
                      );
                      const allowedMinutesForHour = new Set(
                        startAllowedTotals
                          .filter((t) => {
                            const p = fromTotalMinutesToParts(t);
                            return (
                              p.ampm === parts.ampm && p.hour12 === parts.hour12
                            );
                          })
                          .map((t) => fromTotalMinutesToParts(t).minute),
                      );

                      const applyCandidate = (candidateParts) => {
                        const candidateTotal =
                          toTotalMinutesFromParts(candidateParts);
                        const nextTotal = firstAllowedAtOrAfter(
                          startAllowedTotals,
                          candidateTotal,
                        );
                        setStartTotalMinutes(nextTotal);
                      };

                      return (
                        <>
                          <select
                            className="time-select"
                            value={parts.hour12}
                            onChange={(e) =>
                              applyCandidate({
                                ...parts,
                                hour12: e.target.value,
                                minute: allowedMinutesForHour.size
                                  ? parts.minute
                                  : MINUTE_OPTIONS[0],
                              })
                            }
                            required
                            disabled={!startAllowedTotals.length}
                          >
                            {!startAllowedTotals.length && (
                              <option value="">No times</option>
                            )}
                            {startAllowedTotals.length &&
                              HOUR_12_OPTIONS.filter((h) =>
                                parts.ampm ? allowedHoursForAmpm.has(h) : true,
                              ).map((hour) => (
                                <option key={hour} value={hour}>
                                  {hour}
                                </option>
                              ))}
                          </select>

                          <select
                            className="time-select"
                            value={parts.minute}
                            onChange={(e) =>
                              applyCandidate({
                                ...parts,
                                minute: e.target.value,
                              })
                            }
                            required
                            disabled={!startAllowedTotals.length}
                          >
                            {MINUTE_OPTIONS.filter((m) =>
                              !parts.hour12 || !parts.ampm
                                ? true
                                : allowedMinutesForHour.has(m),
                            ).map((minute) => (
                              <option key={minute} value={minute}>
                                {minute}
                              </option>
                            ))}
                          </select>

                          <select
                            className="time-select ampm"
                            value={parts.ampm}
                            onChange={(e) => {
                              const nextAmpm = e.target.value;
                              const candidate = {
                                ...parts,
                                ampm: nextAmpm,
                              };
                              const candidateTotal =
                                toTotalMinutesFromParts(candidate);
                              const nextTotal = firstAllowedAtOrAfter(
                                startAllowedTotals,
                                candidateTotal,
                              );

                              if (nextTotal == null) {
                                const fallbackTotal = firstAllowedAtOrAfter(
                                  startAllowedTotals,
                                  null,
                                );
                                setStartTotalMinutes(fallbackTotal);
                              } else {
                                setStartTotalMinutes(nextTotal);
                              }
                            }}
                            required
                            disabled={!startAllowedTotals.length}
                          >
                            {AMPM_OPTIONS.map((v) => (
                              <option
                                key={v}
                                value={v}
                                disabled={!allowedAmpm.has(v)}
                              >
                                {v}
                              </option>
                            ))}
                          </select>
                        </>
                      );
                    })()}
                  </div>
                </div>

                <div className="booking-field">
                  <label htmlFor="endTime">End Time</label>
                  <div
                    className="time-selectors"
                    aria-label="End time selectors"
                  >
                    {(() => {
                      const parts =
                        endTotalMinutes != null
                          ? fromTotalMinutesToParts(endTotalMinutes)
                          : { hour12: "", minute: "", ampm: "" };

                      const allowedAmpm = new Set(
                        endAllowedTotals.map(
                          (t) => fromTotalMinutesToParts(t).ampm,
                        ),
                      );
                      const allowedHoursForAmpm = new Set(
                        endAllowedTotals
                          .filter(
                            (t) =>
                              fromTotalMinutesToParts(t).ampm === parts.ampm,
                          )
                          .map((t) => fromTotalMinutesToParts(t).hour12),
                      );
                      const allowedMinutesForHour = new Set(
                        endAllowedTotals
                          .filter((t) => {
                            const p = fromTotalMinutesToParts(t);
                            return (
                              p.ampm === parts.ampm && p.hour12 === parts.hour12
                            );
                          })
                          .map((t) => fromTotalMinutesToParts(t).minute),
                      );

                      const applyCandidate = (candidateParts) => {
                        const candidateTotal =
                          toTotalMinutesFromParts(candidateParts);
                        const nextTotal = firstAllowedAtOrAfter(
                          endAllowedTotals,
                          candidateTotal,
                        );
                        setEndTotalMinutes(nextTotal);
                      };

                      const disabled =
                        startTotalMinutes == null || !endAllowedTotals.length;

                      return (
                        <>
                          <select
                            className="time-select"
                            value={parts.hour12}
                            onChange={(e) =>
                              applyCandidate({
                                ...parts,
                                hour12: e.target.value,
                                minute: allowedMinutesForHour.size
                                  ? parts.minute
                                  : MINUTE_OPTIONS[0],
                              })
                            }
                            required
                            disabled={disabled}
                          >
                            {disabled && <option value="">--</option>}
                            {!disabled &&
                              HOUR_12_OPTIONS.filter((h) =>
                                parts.ampm ? allowedHoursForAmpm.has(h) : true,
                              ).map((hour) => (
                                <option key={hour} value={hour}>
                                  {hour}
                                </option>
                              ))}
                          </select>

                          <select
                            className="time-select"
                            value={parts.minute}
                            onChange={(e) =>
                              applyCandidate({
                                ...parts,
                                minute: e.target.value,
                              })
                            }
                            required
                            disabled={disabled}
                          >
                            {disabled && <option value="">--</option>}
                            {!disabled &&
                              MINUTE_OPTIONS.filter((m) =>
                                !parts.hour12 || !parts.ampm
                                  ? true
                                  : allowedMinutesForHour.has(m),
                              ).map((minute) => (
                                <option key={minute} value={minute}>
                                  {minute}
                                </option>
                              ))}
                          </select>

                          <select
                            className="time-select ampm"
                            value={parts.ampm}
                            onChange={(e) => {
                              const nextAmpm = e.target.value;
                              const candidate = { ...parts, ampm: nextAmpm };
                              const candidateTotal =
                                toTotalMinutesFromParts(candidate);
                              const nextTotal = firstAllowedAtOrAfter(
                                endAllowedTotals,
                                candidateTotal,
                              );
                              setEndTotalMinutes(nextTotal);
                            }}
                            required
                            disabled={disabled}
                          >
                            {disabled && <option value="">--</option>}
                            {!disabled &&
                              AMPM_OPTIONS.map((v) => (
                                <option
                                  key={v}
                                  value={v}
                                  disabled={!allowedAmpm.has(v)}
                                >
                                  {v}
                                </option>
                              ))}
                          </select>
                        </>
                      );
                    })()}
                  </div>
                </div>
              </div>

              {error && <div className="booking-error">{error}</div>}

              <div className="booking-actions">
                <button
                  type="button"
                  className="booking-cancel-btn"
                  onClick={onClose}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="booking-submit-btn"
                  disabled={bookingMutation.isPending}
                >
                  {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        <BookingSuccessModal
          bookingDetails={bookingDetails}
          onClose={handleSuccessClose}
        />
      )}
    </>
  );
};

export default BookingModal;
