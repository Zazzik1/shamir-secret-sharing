import styled from '@emotion/styled';

export const BORDER_COLOR = 'rgb(25, 41, 65)';
export const BACKGROUND_COLOR = 'rgb(4, 7, 12)';
export const BACKGROUND_COLOR_SUCCESS = '#324b32';
export const CARD_BACKGROUND_COLOR = 'rgb(8, 15, 24)';
export const CARD_BACKGROUND_COLOR_LIGHTER = 'rgb(15, 28, 48)';
export const INPUT_TEXT_COLOR = 'rgb(197, 208, 245)';
export const HEADING_TEXT_COLOR = '#d5e6ca';

type NumberInputProps = {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
};

const NumberInputWrapper = styled.div`
    * {
        font-family: RobotoMono, monospace;
        font-size: 14px;
        padding: 8px 10px;
        background-color: ${BACKGROUND_COLOR};
        border: 1px solid ${BORDER_COLOR};
        color: ${INPUT_TEXT_COLOR};
    }
    input {
        width: 150px;
        border-radius: 4px 0 0 4px;
        outline: none;
        &:focus {
            border-color: ${HEADING_TEXT_COLOR};
        }
    }
    button {
        outline-color: ${HEADING_TEXT_COLOR};
        border-left: 0;
        width: 4ch;
        background-color: ${CARD_BACKGROUND_COLOR_LIGHTER};
        &:last-child {
            border-radius: 0 4px 4px 0;
        }
        &:not(&:disabled) {
            cursor: pointer;
            &:hover {
                background-color: ${CARD_BACKGROUND_COLOR};
                transition: 50ms ease;
            }
        }
        &:disabled {
            background-color: #1d1d1d;
            color: #4e4e4e;
        }
    }
`;

export const NumberInput = ({
    value,
    onChange,
    min,
    max,
    step = 1,
}: NumberInputProps) => {
    return (
        <NumberInputWrapper>
            <input
                value={value}
                onChange={(e) => {
                    const value = +e.target.value;
                    if (Number.isNaN(value)) return;
                    if (typeof min !== 'undefined' && value < min)
                        return onChange(min);
                    if (typeof max !== 'undefined' && value > max)
                        return onChange(max);
                    onChange(value);
                }}
            />
            <button
                onClick={() => {
                    if (typeof max !== 'undefined' && value + step > max)
                        return onChange(max);
                    onChange(value + step);
                }}
                disabled={typeof max !== 'undefined' && value + step > max}
            >
                +
            </button>
            <button
                onClick={() => {
                    if (typeof min !== 'undefined' && value - step < min)
                        return onChange(min);
                    onChange(value - step);
                }}
                disabled={typeof min !== 'undefined' && value - step < min}
            >
                -
            </button>
        </NumberInputWrapper>
    );
};

export const Button = styled.button`
    font-family: Calibri;
    font-size: 16px;
    padding: 8px 10px;
    background-color: ${CARD_BACKGROUND_COLOR_LIGHTER};
    border: 1px solid ${BORDER_COLOR};
    color: white;
    outline: none;
    border-radius: 10px;
    &:not(&:disabled) {
        cursor: pointer;
        transition: 50ms ease;
        &:hover {
            background-color: ${BACKGROUND_COLOR_SUCCESS};
        }
    }
    &:disabled {
        background-color: #202020;
        color: gray;
        border-color: #525252;
    }
    &:focus {
        border-color: ${HEADING_TEXT_COLOR};
    }
`;

export const ShareInput = styled.input`
    outline: none;
    &:focus {
        border-color: ${HEADING_TEXT_COLOR};
    }

    padding: 8px 10px;
    color: ${INPUT_TEXT_COLOR};
    background-color: ${BACKGROUND_COLOR};
    border: 1px solid ${BORDER_COLOR};
    border-radius: 2px;
    font-family: RobotoMono, monospace;
    font-size: 14px;
    &::placeholder {
        color: rgb(113, 123, 156);
        font-style: italic;
    }
`;

export const ShareOutput = styled.div`
    background-color: ${CARD_BACKGROUND_COLOR_LIGHTER};
    color: ${INPUT_TEXT_COLOR};
    padding: 8px 10px;
    width: 100%;
    line-break: anywhere;
    max-width: 100%;
    box-sizing: border-box;
    border-radius: 4px;
    font-family: RobotoMono, monospace;
    font-size: 14px;
`;

export const Heading = styled.div<{ size?: 'md' | 'sm' }>`
    font-size: ${({ size }) => (size === 'sm' ? '16px' : '20px')};
    color: ${HEADING_TEXT_COLOR};
    padding: 8px 0;
    padding-left: 16px;
    font-family: OpenSans;
`;

export const TextArea = styled.textarea`
    outline: none;
    &:focus {
        border-color: ${HEADING_TEXT_COLOR};
    }

    padding: 8px 10px;
    color: ${INPUT_TEXT_COLOR};
    background-color: ${BACKGROUND_COLOR};
    border: 1px solid ${BORDER_COLOR};
    border-radius: 2px;
    font-family: RobotoMono, monospace;
    font-size: 14px;
    width: 100%;
    box-sizing: border-box;
    resize: vertical;
`;

const FooterWrapper = styled.div`
    border-top: 1px solid ${BORDER_COLOR};
    width: 100%;
    text-align: right;
    padding: 8px 16px;
    box-sizing: border-box;
    a {
        color: ${HEADING_TEXT_COLOR};
        text-decoration: none;
        &:hover {
            text-decoration: underline;
        }
    }
`;

export const Footer = () => {
    return (
        <FooterWrapper>
            <a
                href="https://github.com/Zazzik1/shamir-secret-sharing"
                target="_blank"
            >
                github
            </a>
        </FooterWrapper>
    );
};
