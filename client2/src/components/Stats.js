import React from "react";
import { useGetUserID } from "../hooks/useGetUserID";

export const Stats = () => {
    const userID = useGetUserID();
    //winstreak, longest winstreak, win percentage, total wins
    return (<div className="about">
    <h1 className="title">User Statistics</h1>
    <div>
    <h3 className="title">coming soon...</h3>
    </div>
    </div>)
}

