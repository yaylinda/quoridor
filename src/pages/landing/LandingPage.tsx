import { Container, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { UserCollectionObject } from '../../types';
import './LandingPage.css';

interface LandingPageProps {
    user: UserCollectionObject,
}

function LandingPage({ user }: LandingPageProps) {

    const createGame = () => {
        
    }

    return (
        <Container className='landing_page_container'>
            <Button variant="contained" color="success" onClick={createGame}>Start New Game</Button>
        </Container>
    );
}

export default LandingPage;