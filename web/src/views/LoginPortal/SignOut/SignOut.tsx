import React, { useEffect, useCallback, useState } from "react";
import LoginLayout from "../../../layouts/LoginLayout";
import { useNotifications } from "../../../hooks/NotificationsContext";
import { signOut } from "../../../services/SignOut";
import { Typography, makeStyles } from "@material-ui/core";
import { Redirect } from "react-router";
import { FirstFactorRoute } from "../../../Routes";
import { useRedirectionURL } from "../../../hooks/RedirectionURL";
import { useIsMountedRef } from "../../../hooks/Mounted";
import { useRedirector } from "../../../hooks/Redirector";

export interface Props { }

export default function (props: Props) {
    const mounted = useIsMountedRef();
    const style = useStyles();
    const { createErrorNotification } = useNotifications();
    const redirectionURL = useRedirectionURL();
    const [timedOut, setTimedOut] = useState(false);
    const redirector = useRedirector();

    const doSignOut = useCallback(async () => {
        try {
            // TODO(c.michaud): pass redirection URL to backend for validation.
            await signOut();
            setTimeout(() => {
                if (!mounted) {
                    return;
                }
                setTimedOut(true);
            }, 2000);
        } catch (err) {
            console.error(err);
            createErrorNotification("There was an issue signing out");
        }
    }, [createErrorNotification, setTimedOut, mounted]);

    useEffect(() => { doSignOut() }, [doSignOut]);

    if (timedOut) {
        if (redirectionURL) {
            redirector(redirectionURL);
        } else {
            return <Redirect to={FirstFactorRoute} />
        }
    }

    return (
        <LoginLayout title="Sign out">
            <Typography className={style.typo} >
                You're being signed out and redirected...
            </Typography>
        </LoginLayout>
    )
}

const useStyles = makeStyles(theme => ({
    typo: {
        padding: theme.spacing(),
    }
}))