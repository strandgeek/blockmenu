import React, { FC } from 'react';
import styled from 'styled-components';

const Style = styled.div`
    .svg-success {
        display: inline-block;
        vertical-align: top;
        height: 128px;
        width: 128px;
        opacity: 1;
        overflow: visible;

        @keyframes success-tick {
            0% {
                stroke-dashoffset: 16px;
                opacity: 1;
            }

            100% {
                stroke-dashoffset: 31px;
                opacity: 1;
            }
        }

        @keyframes success-circle-outline {
            0% {
                stroke-dashoffset: 72px;
                opacity: 1;
            }

            100% {
                stroke-dashoffset: 0px;
                opacity: 1;
            }
        }

        @keyframes success-circle-fill {
            0% {
                opacity: 0;
            }

            100% {
                opacity: 1;
            }
        }

        .success-tick {
            fill: none;
            stroke-width: 1px;
            stroke: #ffffff;
            stroke-dasharray: 15px, 15px;
            stroke-dashoffset: -14px;
            animation: success-tick 450ms ease 1400ms forwards;
            opacity: 0;
        }

        .success-circle-outline {
            fill: none;
            stroke-width: 1px;
            stroke: #81c038;
            stroke-dasharray: 72px, 72px;
            stroke-dashoffset: 72px;
            animation: success-circle-outline 300ms ease-in-out 800ms forwards;
            opacity: 0;
        }

        .success-circle-fill {
            fill: #81c038;
            stroke: none;
            opacity: 0;
            animation: success-circle-fill 300ms ease-out 1100ms forwards;
        }

        // Can't animate stroke-dashoffset on IE 10 and 11, just show svg instead
        @media screen and (-ms-high-contrast: active), screen and (-ms-high-contrast: none) {
            .success-tick {
                stroke-dasharray: 0;
                stroke-dashoffset: 0;
                animation: none;
                opacity: 1;
            }

            .success-circle-outline {
                stroke-dasharray: 0;
                stroke-dashoffset: 0;
                animation: none;
                opacity: 1;
            }

            .success-circle-fill {
                animation: none;
                opacity: 1;
            }
        }
    }
`;

export interface SuccessTickProps {}

export const SuccessTick: FC<SuccessTickProps> = (props) => {
    return (
        <Style>
            <svg xmlns="http://www.w3.org/2000/svg" className="svg-success" viewBox="0 0 24 24">
                <g strokeLinecap="round" strokeLinejoin="round" strokeMiterlimit={10}>
                    <circle className="success-circle-outline" cx={12} cy={12} r="11.5" />
                    <circle className="success-circle-fill" cx={12} cy={12} r="11.5" />
                    <polyline className="success-tick" points="17,8.5 9.5,15.5 7,13" />
                </g>
            </svg>
        </Style>
    );
};
