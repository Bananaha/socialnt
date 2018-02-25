import styled from "styled-components";
import { BUTTON_COLOR, LINK_COLOR, BORDER_COLOR } from "./variables";
import { lighten } from "polished";

export const Button = styled.button`
  cursor: pointer;
  padding: 6px;
  transition: background-color 0.2s ease-out;
  background: none;
  border: none;
  background: ${BUTTON_COLOR};
  color: white;
  border-radius: 3px;
  font-weight: 100;
  font-size: 14px;

  &:hover {
    background-color: ${lighten(0.1, BUTTON_COLOR)};
  }
`;

export const Input = styled.input`
  border: 1px solid ${BORDER_COLOR};
  padding: 3px;
  background: white;
  display: block;
  width: 100%;
  margin-bottom: 6px;
`;

export const Card = styled.div`
  box-shadow: 1px 1px 3px rgba(0, 0, 0, 0.1);
  border-radius: 3px;
  background: white;
  margin: 12px auto;
  padding: 15px;
`;

export const A = styled.a`
  cursor: pointer;
  text-decoration: underline;
  color: ${LINK_COLOR};
  font-weight: 100;
  background: none;
  padding: 0;
  border: 0;

  &:hover {
    text-decoration: none;
  }
`;
