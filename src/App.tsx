import { DataProvider } from './context/DataContext';
import PresentationMode from './components/presentation/PresentationMode';

export default function App() {
  return (
    <DataProvider>
      <PresentationMode />
    </DataProvider>
  );
}
