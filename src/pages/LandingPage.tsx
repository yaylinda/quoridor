import { Container, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { UserCollectionObject } from '../types';

interface LandingPageProps {
    user: UserCollectionObject,
}

function LandingPage({ user }: LandingPageProps) {

    const createGame = () => {

    }

    return (
        <Container>
            <Button variant="contained" onClick={createGame}>Start New Game</Button>
        </Container>
    );
}

export default LandingPage;