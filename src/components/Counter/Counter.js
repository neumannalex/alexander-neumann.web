import React, { Component, useState, useEffect } from "react";
import {
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Image,
  Icon,
  List,
  Menu,
  Segment,
  Button
} from "semantic-ui-react";
import { Link, NavLink } from 'react-router-dom';

export const Counter = () => {
    const [count, setCount] = useState(0);

    const handleIncrement = () =>
    setCount(currentCount => currentCount + 1);
    
    const handleDecrement = () =>
    setCount(currentCount => currentCount - 1);

    // useEffect(
    //     setCount(currentCount => currentCount + 1)
    // );

    return (
        <div>
        <h3>Counts: {count}</h3>

        <button type="button" onClick={handleIncrement}>+</button>
        <button type="button" onClick={handleDecrement}>-</button>

        </div>
    );
}