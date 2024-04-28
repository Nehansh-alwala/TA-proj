/* eslint-disable no-unused-vars */
import React from "react";
import supabase from "../config/supabaseClient";
import {useNavigate,Link } from 'react-router-dom'
import { Button, Flex } from "@mantine/core";

const Profile=({token})=>{
    const navigate = useNavigate();
    
    return(
        <div>
            <h3>Hello, {token.user.user_metadata.fullName}</h3>
            <p>{token.user.email}</p>
            <Flex gap="lg">
                <Button onClick={()=>navigate(-1)}>
                    Go Back
                </Button>
            </Flex>

        </div>
      
    );
}

export default Profile