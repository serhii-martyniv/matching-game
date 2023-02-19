import './styles/styles.css'
import { MatchGrid } from './matchGrid';
import { initialData } from './mocks';

const { rows, columns, width, height, matchesLitim, timeGmeLimit, timePreviewLimit } = initialData;

const matchGrid = new MatchGrid(matchesLitim, width, height, columns, rows, timeGmeLimit, timePreviewLimit);

matchGrid.init();
