import React from 'react'
import { Button , Stack } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Public = () => {
    const navigate = useNavigate();
  return (
    <div>
         <Stack direction="row" justifyContent="center" spacing={2} mt={3}>
                    <Button variant="contained" color="secondary" onClick={() => { navigate("/qp") }}>
                        Quiz
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => { navigate("/flash-public") }}>
                        Blind
                    </Button>
                    <Button variant="contained" color="secondary" onClick={() => { navigate("/my-words-public") }}>
                        My Words
                    </Button>
                </Stack>
    </div>
  )
}

export default Public