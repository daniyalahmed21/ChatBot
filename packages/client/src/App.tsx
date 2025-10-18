import './App.css';
// import ChatBot from './components/ChatBot';
import { ReviewList } from './components/review/reviewList';

function App() {
    return (
        <div>
            <ReviewList productId={1} />
        </div>
    );
}

export default App;
