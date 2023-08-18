import React from 'react'

export const About = () => {
    return (
        <div className='about'>
        <h1 className='title'>About</h1>
        <h2 className='desc' >This app allows users to test their ball knowledge by allowing them to guess the outcome of any upcoming NBA
        games. Users are able to access their Betting History as well as some trivial statistics. User must be LOGGED IN to unlock the functionality
        of the application.
        This app was developed using the MERN stack app, and allows users to perform CRUD operations.
        </h2>
        <a href='https://github.com/sdotlee24/mock-bets'>GitHub Repo</a> 
        </div>
    );
}