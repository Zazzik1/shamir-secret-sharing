import styled from '@emotion/styled';

type NumberInputProps = {
    value: number;
    onChange: (value: number) => void;
    min?: number;
    max?: number;
    step?: number;
};

const NumberInputWrapper = styled.div`
    * {
        font-family: monospace;
        font-size: 18px;
        padding: 6px 8px;
        background-color: rgb(5 5 30);
        border: 1px solid rgb(17 17 89);
        color: rgb(197, 208, 245);
    }
    input {
        width: 150px;
        border-radius: 4px 0 0 4px;
        outline: none;
        &:focus {
            border-color: yellow;
        }
    }
    button {
        outline-color: yellow;
        border-left: 0;
        width: 3.5ch;
        background-color: rgb(9 9 51);
        &:last-child {
            border-radius: 0 4px 4px 0;
        }
        &:not(&:disabled) {
            cursor: pointer;
            &:hover {
                background-color: rgb(7, 7, 19);
                transition: 50ms ease;
            }
        }
        &:disabled {
            background-color: #121212;
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
    padding: 6px 8px;
    background-color: #314931;
    border: 1px solid #618a61;
    color: white;
    outline: none;
    &:not(&:disabled) {
        cursor: pointer;
        &:hover {
            background-color: #395539;
            transition: 50ms ease;
        }
    }
    &:disabled {
        background-color: #202020;
        color: gray;
        border-color: #525252;
    }
    &:focus {
        border-color: yellow;
    }
`;

export const ShareInput = styled.input`
    outline: none;
    &:focus {
        border-color: yellow;
    }

    padding: 8px 16px;
    color: rgb(197, 208, 245);
    background-color: rgb(5 5 30);
    border: 1px solid rgb(17 17 89);
    border-radius: 2px;
    font-family: monospace;
    font-size: 14px;
`;

export const ShareOutput = styled.div`
    background-color: rgb(5 5 30);
    color: rgb(197, 208, 245);
    padding: 8px 16px;
    width: max-content;
    line-break: anywhere;
    max-width: 100%;
    box-sizing: border-box;
    border-radius: 4px;
    font-family: monospace;
    font-size: 14px;
`;

export const Heading = styled.div`
    font-size: 22px;
    font-family: Arial;
    color: #e0e084;
    padding: 8px 0;
`;

export const TextArea = styled.textarea`
    outline: none;
    &:focus {
        border-color: yellow;
    }

    padding: 8px 16px;
    color: rgb(197, 208, 245);
    background-color: rgb(5 5 30);
    border: 1px solid rgb(17 17 89);
    border-radius: 2px;
    font-family: monospace;
    font-size: 14px;
`;
