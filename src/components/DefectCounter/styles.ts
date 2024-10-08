import styled from 'styled-components';
import { Row } from "antd";

export const CounterWrapper = styled.div`
    margin: 10px 0;
    padding: 5px;

    h1 {
        font-size: 1.8rem;
        margin: 0;

        .defect-count {
            font-weight: bold;
            color: #FE7625;
            text-decoration: underline;
            font-size: 2rem; // Slightly larger than the rest of the text
        }
    }
`;


export const ContentSection = styled("section")`
    position: relative;
    padding: 4rem 0; // Reduce padding to reduce vertical space

    @media only screen and (max-width: 1024px) {
        padding: 2rem 0;
    }
`;

export const Content = styled("p")`
    margin: 1.5rem 0 2rem 0;
`;

export const StyledRow = styled(Row)`
    flex-direction: ${({ direction }: { direction: string }) =>
            direction === "left" ? "row" : "row-reverse"};
`;

export const ContentWrapper = styled("div")`
    text-align: center;
    padding: 10px 0; // Reduce padding for less space
    h2 {
        font-size: 1.5rem; // Reduce font size for the section header
        margin: 0;
    }

    @media only screen and (max-width: 575px) {
        padding-top: 2rem;
    }
`;

export const ServiceWrapper = styled("div")`
    display: flex;
    justify-content: space-between;
    max-width: 100%;
`;

export const MinTitle = styled("h6")`
    font-size: 15px;
    line-height: 1rem;
    padding: 0.5rem 0;
    text-transform: uppercase;
    color: #000;
    font-family: "Motiva Sans Light", sans-serif;
`;

export const MinPara = styled("p")`
    font-size: 13px;
`;

export const Link = styled("a")`
    color: #18216d;
    max-width: fit-content;
    border-bottom: 1px solid #18216d;
    cursor: pointer;
    font-size: 1.25rem;
    transition: all 0.3s ease-in-out;
    text-decoration: none;

    &:hover {
        border-bottom: 1px solid rgb(255, 130, 92);
        color: rgb(255, 130, 92);
        text-decoration: none;
    }
`;

export const ButtonWrapper = styled("div")`
    display: flex;
    justify-content: space-between;
    max-width: 100%;

    @media screen and (min-width: 1024px) {
        max-width: 80%;
    }

    button:last-child {
        margin-left: 20px;
    }
`;
