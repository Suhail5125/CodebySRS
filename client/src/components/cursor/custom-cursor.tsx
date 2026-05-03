import { useEffect, useState } from 'react';
import './cursor.css';

export function CustomCursor() {
    const [position, setPosition] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isClicking, setIsClicking] = useState(false);

    useEffect(() => {
        const updateCursorPosition = (e: MouseEvent) => {
            setPosition({ x: e.clientX, y: e.clientY });
        };

        const handleMouseOver = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            const isInteractive = target.closest('a, button, input, textarea, select, [role="button"], [onclick]');
            setIsHovering(!!isInteractive);
        };

        const handleMouseDown = () => setIsClicking(true);
        const handleMouseUp = () => setIsClicking(false);

        window.addEventListener('mousemove', updateCursorPosition);
        window.addEventListener('mouseover', handleMouseOver);
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);

        return () => {
            window.removeEventListener('mousemove', updateCursorPosition);
            window.removeEventListener('mouseover', handleMouseOver);
            window.removeEventListener('mousedown', handleMouseDown);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, []);

    const cursorClass = [
        'custom-cursor',
        isHovering ? 'cursor-hover' : '',
        isClicking ? 'cursor-click' : '',
    ].join(' ');

    return (
        <div
            className={cursorClass}
            style={{ left: `${position.x}px`, top: `${position.y}px` }}
        >
            <div className="cursor-center" />
            <div className="cursor-brackets">
                <span className="brkt brkt-tl" />
                <span className="brkt brkt-tr" />
                <span className="brkt brkt-bl" />
                <span className="brkt brkt-br" />
            </div>
        </div>
    );
}
