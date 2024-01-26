import '../../../styles/progressbar.css';

function Progressbar(value) {
  if (typeof value === 'undefined') {
    value = 0;
  }

  return (
    <div className="meter">
        <span
          style={{ width: `${value}%` }}>
            <span className="progressbar" />
        </span>
    </div>
  );
}

export default Progressbar;