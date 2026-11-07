// Marks this as a Client Component. It needs browser features like window.setInterval and React’s state and effect hooks.
"use client";



// useState is a React hook that allows you to add state to a functional component. a state is a value that React keeps track of and updates when it changes.
// useEffect runs code after the component appears and handles cleanup. This means it can be used to perform side effects like fetching data, setting up subscriptions, or updating the DOM after render. This makes it essential for update a component like CurrentDate that needs to refresh periodically.
import { useEffect, useState } from "react";



export default function CurrentDate() {
    // const[a, b] = useState<type>(initialValue) is the general form of declaring a state variable with useState.
    // a is what the state variable holds (the current value).
    // b is the function used to update that value.
    // Here we declare a state variable called date, that can only hold a Date object or null, and set its initial value to null, and can be updated using setDate.
    const [date, setDate] = useState<Date | null>(null);

    // Again, useEffect is a method that runs after the component renders and handles cleanup. Here it is used to set up an interval that updates the date every minute and clears the interval when the component unmounts. The empty dependency array ensures this effect runs only once after the initial render. If the dependency array were not empty, the effect would run whenever the specified dependencies change.
    // Similar to an event listener, useEffect can set up something when the component mounts and clean it up when the component unmounts.
    useEffect(() => {
        // First we define a function to update the date state with the current date.
        const updateDate = () => setDate(new Date());
        // Then we immediately call it to set the initial date.
        updateDate();
        // Then we set up an interval to update the date every minute.
        const interval = window.setInterval(updateDate, 60_000);
        // Finally, we return a cleanup function that clears the interval when the component unmounts. Unmounting is when the component is removed from the DOM, and this ensures we don't leave any intervals running in the background.
        return () => window.clearInterval(interval);
    }, []);

    // The component renders a paragraph containing the current date formatted as a long date string. If the date is not yet available (i.e., still null), it renders a non-breaking space to maintain layout consistency.
    // Something new here is the use of the <time> element with the dateTime attribute, which provides a machine-readable date format for better accessibility and SEO. We still display the human-readable format inside the element for users using a Intl.DateTimeFormat which is locale-sensitive and formats the date according to the specified options. 
    return (
        <p className="mt-2 text-sm text-muted lg:mt-5">
            {date ? (
                <time
                    dateTime={`${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`}
                >
                    {new Intl.DateTimeFormat("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                    }).format(date)}
                </time>
            ) : (
                <span aria-hidden="true">&nbsp;</span>
            )}
        </p>
    );
}
