import React, { useEffect, useState } from "react";

export interface ScoreBoardProps {
    endTime: number,
    score: number;
    onTimeout: () => void;
};

const ScoreBoard = ({ endTime, score, onTimeout }: ScoreBoardProps) => {
    const secondsLeft = () => endTime - new Date().getTime();
    const formatTimeleft = () => {
        const left = secondsLeft();
        if (left < 0) return "00:00:000";

        const millis = Math.round(left % 1000);
        const seconds = Math.round((left / 1000) % 60);
        const minutes = Math.round((left / 1000) / 60);

        return `${
            minutes.toLocaleString(undefined, { minimumIntegerDigits: 2 })
        }:${
            seconds.toLocaleString(undefined, { minimumIntegerDigits: 2 })
        }:${
            millis.toLocaleString(undefined, { minimumIntegerDigits: 3 })
        }`;
    };

    const [timeString, setTimeString] = useState<string>(
        () => formatTimeleft()
    );

    useEffect(() => { setInterval(() => {
        if (secondsLeft() < 0) onTimeout();
        setTimeString(formatTimeleft())
    }, 50) }, []);

    return (
        <div className="ScoreBoard">
            {timeString} | {score}
        </div>
    );
}

export default ScoreBoard;
