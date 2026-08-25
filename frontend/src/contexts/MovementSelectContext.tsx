import Select, {
  type SingleValue,
  type FilterOptionOption,
} from "react-select";

import { useMovements } from "../contexts/MovementContext";
import type { Movement } from "../types/movement";

interface MovementOption {
  value: string;
  label: string;
  movement: Movement;
}

interface MovementSelectorProps {
  onSelect: (movement: Movement) => void;
}

function MovementSelector({ onSelect }: MovementSelectorProps) {
  const { movements } = useMovements();

  const movementOptions: MovementOption[] = movements.map((movement) => ({
    value: movement._id,
    label: movement.name,
    movement,
  }));

  function handleChange(selectedOption: SingleValue<MovementOption>) {
    if (!selectedOption) {
      return 
    }

    onSelect(selectedOption.movement);
  }

  function filterMovements(
    option: FilterOptionOption<MovementOption>,
    inputValue: string
  ) {
    return option.label
      .toLowerCase()
      .startsWith(inputValue.toLowerCase());
  }

  return (
    <Select<MovementOption>
      options={movementOptions}
      onChange={handleChange}
      filterOption={filterMovements}
      placeholder="Search for a movement..."
      isSearchable
      isClearable
      openMenuOnClick
      noOptionsMessage={() => "No movements found"}
    />
  ); 
}

export default MovementSelector; 