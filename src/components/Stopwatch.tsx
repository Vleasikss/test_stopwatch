import React from "react";
import { useEffect, useState, useCallback } from "react";
import {interval, Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {formatTime} from "../util/DateUtil";
import "./styles.css";

enum StatusType {
    STOP="stop",
    START="start",
    WAIT="wait"
}
const DOUBLE_CLICK_TIME = 300;



const Stopwatch:React.FC = () => {
    const [seconds, setSeconds] = useState(0);
    const [status, setStatus] = useState<StatusType>(StatusType.STOP);
    const [previousClickTime, setPreviousClickTime] = useState(0);

    useEffect(() => {
        let destroy$:Subject<void> = new Subject();
        interval(1000)
            .pipe(takeUntil(destroy$))
            .subscribe(() => {
                if (status === StatusType.START) {
                    setSeconds(val => ++val);
                }
            });
        return () => {
            destroy$.next();
            destroy$.complete();
        };
    }, [status]);

    const handleStartButtonClick = useCallback(() => {
        setStatus(StatusType.START);
    }, []);
    const handleStopButtonClick = useCallback(() => {
        setStatus(StatusType.STOP);
        setSeconds(0);
    }, []);
    const handleResetButtonClick = useCallback(() => {
        setSeconds(0);
    }, []);
    const handleWaitButtonClick = useCallback(() => {
        const currentClickTime = new Date().getTime();
        if (previousClickTime && currentClickTime - previousClickTime <= DOUBLE_CLICK_TIME) {
            setStatus(StatusType.WAIT);
        }
        setPreviousClickTime(currentClickTime);
    }, [previousClickTime]);

    return (
        <>
            <h2>{formatTime(seconds)}</h2>
            <button className={"stopwatch-btn"}
                    disabled={status === StatusType.START}
                    onClick={handleStartButtonClick}>Start</button>
            <button className={"stopwatch-btn"}
                    disabled={status === StatusType.STOP}
                    onClick={handleStopButtonClick}>Stop</button>
            <button className={"stopwatch-btn"}
                    onClick={handleResetButtonClick}>Reset</button>
            <button className={"stopwatch-btn"}
                    title={"Click twice to wait"}
                    disabled={status === StatusType.WAIT}
                    onClick={handleWaitButtonClick}>Wait</button>
        </>
    );
}

export default Stopwatch;