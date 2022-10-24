import { Spinner } from 'react-bootstrap';

const Loading = ({variant='blue'}) => {
    return (
        <div className='text-center'>
            <Spinner animation="border" role="status" variant={variant} />
        </div>
    );
}

export default Loading;