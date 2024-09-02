import React, { useState, useEffect, useRef, useCallback } from "react";
import {
    Container,
    Center,
    Button,
    TextInput,
    Title,
    Select,
    Paper,

} from "@mantine/core";
import { useForm } from "@mantine/form";
import { sendAssignInterview } from "../apis/mycvtracker";
import { bookTechInterview } from "../apis/mycvtracker/assign-interview";
import { useUserState } from "../hooks/useUserState";
import { alerts } from "../utils/alert-utils";
import { useToast } from "../hooks/useToast";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";
import styles from "../styles/questionAdd.module.css";

let handleColor = (time: { getHours: () => number; }) => {
    return time.getHours() > 12 ? "text-success" : "text-error";
};

const BookInterview_Tech = () => {
    const { token } = useUserState();
    const { showErrorToast, showSuccessToast } = useToast();
    const [isLoading, setIsLoading] = useState(false);
    const [startDate, setStartDate] = useState(new Date());

    const details = useForm({
        initialValues: {
            candidateName: "",
            candidateEmail: "",
            mobile: "",
            location: "",
            interviewDate: "",
            timeSlot: "",
            skills: "",
            timeZone: ""
        },
        validate: {
            candidateEmail: (value) =>
                /^\S+@\S+$/.test(value) ? null : "Invalid Candidate Email",
            candidateName: (value) =>
                value.length <= 1 ? "Candidate name cannot be empty" : null,
            mobile: (value) => (value.length <= 9 ? "Mobile number cannot be empty and enter 10 digits" : null),
            interviewDate: (value) => (value.length <= 1 ? "interviewDate name cannot be empty" : null),
             location: (value) => (value.length <= 1 ? "location  cannot be empty" : null),
        },
    });

    type FormType = typeof details.values;

    const handleFormSubmit = useCallback(
        async (values: FormType) => {
                   try {
                setIsLoading(true);
                await bookTechInterview(
                    {
                        ...values,
                    },
                    token
                );
                showSuccessToast("Your Request has been submitted");

            } catch (e: any) {
                console.log(e);
                if (alerts[e.response.status])
                    showErrorToast(alerts[e.response.status].message);
                else showErrorToast("Encountered Some Error");
            } finally {
                setIsLoading(false);
            }
        },
        [token, showErrorToast, showSuccessToast]
    );
    const handleDateChange = (e: any) => {
        setStartDate(e);
        const book_date = moment(e).format("DD/MM/yyyy");
        const book_time = moment(e).format("hh:mm A");
        details.values.interviewDate = book_date;
        details.values.timeSlot = book_time;
    };
    const filterPassedTime = (time: string | number | Date) => {
        const currentDate = new Date();
        const selectedDate = new Date(time);
        return currentDate.getTime() < selectedDate.getTime();
    };
    // const Date = new Date();;
    function addDays(arg0: Date, arg1: number): Date {
        const currentDate = new Date();
        const no = 3;
        return currentDate;
    }
    return (
        <Container>

            <Paper p="md" my="md">
                <form onSubmit={details.onSubmit(handleFormSubmit)}>
                    <>
                        <TextInput
                            placeholder="Candidate Name"
                            label="Candidate Name"
                            withAsterisk
                            {...details.getInputProps("candidateName")}
                        />
                        <TextInput
                            placeholder="Candidate Email"
                            label="Candidate Email"
                            withAsterisk
                            {...details.getInputProps("candidateEmail")}
                        />
                        <TextInput
                            placeholder="Mobile Number"
                            label="Mobile Number"
                            withAsterisk
                            {...details.getInputProps("mobile")}
                        />
                        <TextInput
                            placeholder="Current Location"
                            label="Current Location"
                            withAsterisk
                            {...details.getInputProps("location")}
                        />
                        <div className={styles.deadline__date}>Interview Date And Time(UTC)</div>
                        <DatePicker
                            selected={startDate}
                            onChange={(e) => handleDateChange(e)}
                            showTimeSelect
                            //timeFormat="HH:mm"
                            timeIntervals={30}
                            dateFormat="dd/mm/yyyy h:mm aa"
                            timeClassName={handleColor}
                            filterTime={filterPassedTime}
                            includeDates={[new Date(), addDays(new Date(), 5)]}
                        />
                        <div></div>
                        <Button
                            type="submit"
                            variant="filled"
                            my="sm"
                            disabled={isLoading}
                            loading={isLoading}
                        >
                            Add
                        </Button>
  {/* <iframe src="https://calendly.com/james-empathytalent/15min?month=2023-08&date=2023-08-17" width="100%" height="950" scrolling="no" frameborder="0"></iframe> */}
               
                    </>
                </form>
            </Paper>

        </Container>
    );
}

export default BookInterview_Tech