import React from 'react';

const ellipses = { overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' };

function trimQrCode(qrcode) {
  return qrcode.split('\n').map(x => x.trim()).join('\n').trim()
}

const Badge = ({ badge, eventName }) => (
  <div className="card" style={{ width: '24rem', marginBottom: '4rem' }}>
    <div className="card-header">
      <h2 style={{ ...ellipses, margin: 0 }}>{eventName}</h2>
    </div>
    <div className="card-body">
      <div className="container">
        <div className="row">
          <div className="col">
            <h5 className="card-title" style={ellipses}>{badge.name}</h5>
            <h6 className="card-subtitle mb-2 text-muted" style={ellipses}>{badge.companyName}</h6>
            <p className="card-text">{badge.role}</p>
          </div>
          <div className="col">
            <pre style={{ textAlign: 'right', lineHeight: '1', fontSize: '40%', marginBottom: 0 }}>{trimQrCode(badge.qrcode)}</pre>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export default Badge;
