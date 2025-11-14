import React, { useState } from 'react';
import styles from './EmailModal.module.css';

export default function EmailModal({ isOpen, onClose, onSend, missingId, missingName }) {
  const [emailText, setEmailText] = useState('');
  const [sending, setSending] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!emailText.trim()) {
      alert('메일 내용을 입력해주세요.');
      return;
    }
    setSending(true);
    try {
      // 타임아웃 설정 (최대 15초 대기)
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('요청 시간이 초과되었습니다.')), 15000)
      );
      
      await Promise.race([onSend(missingId, emailText), timeoutPromise]);
      setEmailText('');
      onClose();
    } catch (error) {
      console.error('메일 전송 실패:', error);
      if (error.message === '요청 시간이 초과되었습니다.') {
        alert('메일 전송에 시간이 오래 걸리고 있습니다. 잠시 후 다시 시도해주세요.');
      }
    } finally {
      setSending(false);
    }
  };

  const handleClose = () => {
    if (!sending) {
      setEmailText('');
      onClose();
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          <h2>메일 보내기</h2>
          <button className={styles.closeButton} onClick={handleClose} disabled={sending}>
            ×
          </button>
        </div>
        <div className={styles.modalBody}>
          <p className={styles.recipientInfo}>
            <strong>{missingName}</strong>님께 메일을 보냅니다.
          </p>
          <form onSubmit={handleSubmit}>
            <div className={styles.formGroup}>
              <label htmlFor="emailText" className={styles.label}>
                메일 내용
              </label>
              <textarea
                id="emailText"
                className={styles.textarea}
                value={emailText}
                onChange={(e) => setEmailText(e.target.value)}
                placeholder="메일 내용을 입력해주세요..."
                rows={10}
                disabled={sending}
                required
              />
            </div>
            <div className={styles.modalFooter}>
              <button type="button" className="btn-white" onClick={handleClose} disabled={sending}>
                취소
              </button>
              <button type="submit" className="btn-mint" disabled={sending}>
                {sending ? '전송 중...' : '보내기'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

