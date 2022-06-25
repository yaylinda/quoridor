import { Box, Container, Typography } from "@mui/material";
import { chunk } from 'lodash';
import { CellData, CellType, GameCollectionObject, User } from "../../types";
import { WIDTH } from "../../utils/gameUtils";
import './Gameboard.css';

interface GameboardProps {
  user: User,
  game: GameCollectionObject,
}

function Gameboard({ user, game }: GameboardProps) {

  const board2D = chunk(game.boardFlattened, WIDTH);

  return (
    <Container className="gameboard_container">
      <Container>
        {
          board2D.map((row, i) => <GameRow key={`row_${i}`} row={row} />)
        }
      </Container>
    </Container>
  );
}

interface GameCellProps {
  cellData: CellData,
}

function GameCell({ cellData }: GameCellProps) {

  const cellWidth = 60;

  if (cellData.type === CellType.CELL) {
    return (
      <Box sx={{
        width: cellWidth,
        height: cellWidth,
        color: 'gray',
        border: '1px solid black',
      }}>
        <Typography>r={cellData.row}</Typography>
        <Typography>c={cellData.col}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      width: cellWidth,
      height: cellWidth,
      color: 'brown',
    }}>
      <Typography>r={cellData.row}</Typography>
      <Typography>c={cellData.col}</Typography>
    </Box>
  );
}

interface GameRowProps {
  row: CellData[],
}

function GameRow({ row }: GameRowProps) {
  return (
    <div className="gameboard_row">
      {
        row.map(cell => <GameCell key={`row_${cell.row}_col_${cell.col}`} cellData={cell} />)
      }
    </div>
  );
}

export default Gameboard;