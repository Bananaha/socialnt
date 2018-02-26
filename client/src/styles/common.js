import styled from "styled-components";
import { BUTTON_COLOR, LINK_COLOR, BORDER_COLOR } from "./variables";
import { lighten } from "polished";

export const Button = styled.button`
  cursor: pointer;
  transition: background-color 0.2s ease-out;
  background: none;
  border: none;
  background: ${BUTTON_COLOR};
  color: white;
  border-radius: 3px;
  font-weight: 100;
  font-size: 13px;
  padding: 10px 20px;
  font-family: "Roboto";
  text-transform: uppercase;
  font-weight: 300;
  letter-spacing: 0.07em;

  &:hover {
    background-color: ${lighten(0.1, BUTTON_COLOR)};
  }
`;

export const SmallButton = Button.extend`
  padding: 6px 8px;
  font-size: 12px;
  font-weight: 400;
  text-transform: none;
`;

export const Input = styled.input`
  border: 1px solid ${BORDER_COLOR};
  padding: 3px;
  background: white;
  display: block;
  width: 100%;
  box-sizing: border-box;
  margin-bottom: 6px;
  font-family: "Roboto";
`;

export const Textarea = Input.withComponent("textarea").extend`
  height: 70px;
  resize: none;
  font-size: 13px;
  padding: 12px;
  font-family: "Roboto";
  font-weight: 300;
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

export const FlexExtend = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

export const PageBody = FlexExtend.extend`
  padding: 20px;
  max-width: 100%;
  width: 600px;
  margin: 0 auto;
  background: white;
  flex: 1;
`;
