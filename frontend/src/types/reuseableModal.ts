interface buttonCombination {
    buttonDisplay : string;
    buttonAction : () => void;
}

export interface ModalProps {
    title : string;
    message : string;
    cancelButton ?: buttonCombination;
    confirmButton : buttonCombination;
}