const API_URL = 'http://localhost:3000/api';
let currentEditingId = null;
let currentEmojiInputId = null;

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', () => {
    loadStatus();
    loadAnimations();
    loadExportAnimations();
    loadShareAnimations();
    setupEventListeners();
    
    // Auto refresh status every 5 seconds
    setInterval(loadStatus, 5000);
});

// ==================== EVENT LISTENERS ====================

function setupEventListeners() {
    // Animation editor
    document.getElementById('newAnimationBtn').addEventListener('click', showEditor);
    document.getElementById('closeEditorBtn').addEventListener('click', hideEditor);
    document.getElementById('saveAnimationBtn').addEventListener('click', saveAnimation);
    document.getElementById('testAnimationBtn').addEventListener('click', testAnimation);
    document.getElementById('addFrameBtn').addEventListener('click', () => addFrame());
    
    // Controls
    document.getElementById('stopBtn').addEventListener('click', stopAnimation);
    document.getElementById('refreshBtn').addEventListener('click', () => {
        loadStatus();
        loadAnimations();
        loadExportAnimations();
        loadShareAnimations();
    });
    
    // Emoji picker
    document.querySelector('.close-modal').addEventListener('click', () => {
        document.getElementById('emojiPicker').style.display = 'none';
    });
    
    document.getElementById('emojiSearch').addEventListener('input', filterEmojis);
    
    // Close modal on background click
    document.getElementById('emojiPicker').addEventListener('click', (e) => {
        if (e.target === document.getElementById('emojiPicker')) {
            document.getElementById('emojiPicker').style.display = 'none';
        }
    });

    // Export/Import
    setupExportImportListeners();
}

function setupExportImportListeners() {
    // Export single
    document.getElementById('exportBtn').addEventListener('click', exportAnimation);
    
    // Import single
    document.getElementById('importBtn').addEventListener('click', () => {
        document.getElementById('importFile').click();
    });
    document.getElementById('importFile').addEventListener('change', importAnimation);
    
    // Export all
    document.getElementById('exportAllBtn').addEventListener('click', exportAllAnimations);
    
    // Import all
    document.getElementById('importAllBtn').addEventListener('click', () => {
        document.getElementById('importAllFile').click();
    });
    document.getElementById('importAllFile').addEventListener('change', importAllAnimations);
    
    // Copy/Paste
    document.getElementById('copyBtn').addEventListener('click', copyToClipboard);
    document.getElementById('pasteBtn').addEventListener('click', pasteFromClipboard);
}

// ==================== STATUS & INFO ====================

async function loadStatus() {
    try {
        const response = await fetch(`${API_URL}/status`);
        const data = await response.json();
        
        document.getElementById('userInfo').textContent = data.user ? 
            `👤 ${data.user.tag}` : '❌ Not connected';
        document.getElementById('emojiCount').textContent = `🎨 ${data.emojis} emojis`;
        
        if (data.isRunning && data.currentAnimation) {
            document.getElementById('animationStatus').textContent = 
                `▶️ ${data.currentAnimation.name} (${data.currentAnimation.currentFrame + 1}/${data.currentAnimation.frames})`;
            document.getElementById('animationStatus').style.color = '#43b581';
        } else {
            document.getElementById('animationStatus').textContent = '⏸️ Stopped';
            document.getElementById('animationStatus').style.color = '#f04747';
        }
    } catch (error) {
        console.error('Load status error:', error);
        document.getElementById('userInfo').textContent = '❌ Connection error';
    }
}

// ==================== ANIMATIONS LIST ====================

async function loadAnimations() {
    try {
        const response = await fetch(`${API_URL}/animations`);
        const animations = await response.json();
        
        const container = document.getElementById('animationsList');
        
        if (animations.length === 0) {
            container.innerHTML = '<p style="color: #666; text-align: center; padding: 40px;">No animations yet. Create your first one! 🎨</p>';
            return;
        }
        
        container.innerHTML = animations.map(anim => `
            <div class="animation-card ${anim.isActive ? 'active' : ''}" data-id="${anim._id}">
                <h3>${escapeHtml(anim.name)} ${anim.isActive ? '▶️' : ''}</h3>
                <div class="animation-info">
                    <div>📊 ${anim.frames.length} frame${anim.frames.length > 1 ? 's' : ''}</div>
                    <div>⏱️ ${anim.interval}ms (${(anim.interval / 1000).toFixed(1)}s)</div>
                    <div>📅 ${new Date(anim.updatedAt).toLocaleDateString()}</div>
                </div>
                <div class="animation-actions">
                    <button class="btn btn-success" onclick="startAnimation('${anim._id}')">▶️ Start</button>
                    <button class="btn btn-secondary" onclick="editAnimation('${anim._id}')">✏️ Edit</button>
                    <button class="btn btn-danger" onclick="deleteAnimation('${anim._id}')">🗑️</button>
                </div>
            </div>
        `).join('');
    } catch (error) {
        console.error('Load animations error:', error);
        document.getElementById('animationsList').innerHTML = '<p style="color: #f04747;">Failed to load animations</p>';
    }
}

// ==================== ANIMATION CONTROL ====================

async function startAnimation(id) {
    try {
        const response = await fetch(`${API_URL}/start/${id}`, { method: 'POST' });
        const result = await response.json();
        
        if (result.success) {
            showNotification('✅ Animation started!', 'success');
            loadStatus();
            loadAnimations();
        } else {
            showNotification('❌ ' + result.message, 'error');
        }
    } catch (error) {
        console.error('Start animation error:', error);
        showNotification('❌ Failed to start animation', 'error');
    }
}

async function stopAnimation() {
    try {
        const response = await fetch(`${API_URL}/stop`, { method: 'POST' });
        const result = await response.json();
        
        if (result.success) {
            showNotification('⏹️ Animation stopped', 'info');
            loadStatus();
            loadAnimations();
        }
    } catch (error) {
        console.error('Stop animation error:', error);
        showNotification('❌ Failed to stop animation', 'error');
    }
}

async function deleteAnimation(id) {
    if (!confirm('Are you sure you want to delete this animation?')) return;
    
    try {
        const response = await fetch(`${API_URL}/animations/${id}`, { method: 'DELETE' });
        
        if (response.ok) {
            showNotification('🗑️ Animation deleted', 'info');
            loadAnimations();
            loadExportAnimations();
            loadShareAnimations();
        }
    } catch (error) {
        console.error('Delete animation error:', error);
        showNotification('❌ Failed to delete animation', 'error');
    }
}

// ==================== ANIMATION EDITOR ====================

function showEditor() {
    currentEditingId = null;
    document.getElementById('editorTitle').textContent = 'Create New Animation';
    document.getElementById('animationId').value = '';
    document.getElementById('animationName').value = '';
    document.getElementById('animationInterval').value = '10000';
    document.getElementById('framesList').innerHTML = '';
    addFrame();
    document.getElementById('editorSection').style.display = 'block';
    document.getElementById('editorSection').scrollIntoView({ behavior: 'smooth' });
}

function hideEditor() {
    document.getElementById('editorSection').style.display = 'none';
}

async function editAnimation(id) {
    try {
        const response = await fetch(`${API_URL}/animations/${id}`);
        const animation = await response.json();
        
        currentEditingId = id;
        document.getElementById('editorTitle').textContent = 'Edit Animation: ' + animation.name;
        document.getElementById('animationId').value = id;
        document.getElementById('animationName').value = animation.name;
        document.getElementById('animationInterval').value = animation.interval;
        
        document.getElementById('framesList').innerHTML = '';
        animation.frames.forEach(frame => {
            addFrame(frame);
        });
        
        document.getElementById('editorSection').style.display = 'block';
        document.getElementById('editorSection').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Edit animation error:', error);
        showNotification('❌ Failed to load animation', 'error');
    }
}

function addFrame(frameData = null) {
    const framesList = document.getElementById('framesList');
    const frameIndex = framesList.children.length;
    const frameId = `frame-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const frameDiv = document.createElement('div');
    frameDiv.className = 'frame-item';
    frameDiv.setAttribute('data-frame-id', frameId);
    
    frameDiv.innerHTML = `
        <div class="frame-header">
            <span class="frame-number">Frame ${frameIndex + 1}</span>
            <button class="btn btn-danger btn-sm" onclick="removeFrame('${frameId}')">🗑️ Remove</button>
        </div>
        <div class="frame-fields">
            <div class="frame-field">
                <label>Status Text:</label>
                <input type="text" placeholder="Enter status text..." class="frame-text" value="${frameData ? escapeHtml(frameData.text) : ''}">
            </div>
            <div class="frame-field">
                <label>Emoji:</label>
                <div style="display: flex; gap: 10px;">
                    <input type="text" placeholder="Click Pick Emoji" class="frame-emoji" value="${frameData ? escapeHtml(frameData.emoji || '') : ''}" readonly>
                    <input type="hidden" class="frame-emoji-id" value="${frameData ? (frameData.emojiId || '') : ''}">
                    <button class="btn btn-secondary" type="button" onclick="openEmojiPicker('${frameId}')">🎨 Pick</button>
                    <button class="btn btn-secondary" type="button" onclick="clearEmoji('${frameId}')">✕</button>
                </div>
            </div>
            <div class="checkbox-group">
                <input type="checkbox" class="frame-eval" id="eval-${frameId}" ${frameData && frameData.isEval ? 'checked' : ''}>
                <label for="eval-${frameId}">Use JavaScript Eval (Dynamic Status)</label>
            </div>
            <div class="frame-field eval-code-field" style="display: ${frameData && frameData.isEval ? 'block' : 'none'};">
                <label>JavaScript Code:</label>
                <textarea placeholder="Example: new Date().toLocaleTimeString('vi-VN')" class="frame-eval-code">${frameData && frameData.evalCode ? escapeHtml(frameData.evalCode) : ''}</textarea>
                <small>The code will be executed every rotation. Return a string.</small>
            </div>
        </div>
    `;
    
    framesList.appendChild(frameDiv);
    
    const evalCheckbox = frameDiv.querySelector('.frame-eval');
    const evalCodeField = frameDiv.querySelector('.eval-code-field');
    
    evalCheckbox.addEventListener('change', () => {
        evalCodeField.style.display = evalCheckbox.checked ? 'block' : 'none';
    });
    
    updateFrameNumbers();
}

function removeFrame(frameId) {
    const frame = document.querySelector(`[data-frame-id="${frameId}"]`);
    if (frame) {
        frame.remove();
        updateFrameNumbers();
    }
}

function updateFrameNumbers() {
    const frames = document.querySelectorAll('.frame-item');
    frames.forEach((frame, index) => {
        frame.querySelector('.frame-number').textContent = `Frame ${index + 1}`;
    });
}

function clearEmoji(frameId) {
    const frame = document.querySelector(`[data-frame-id="${frameId}"]`);
    if (frame) {
        frame.querySelector('.frame-emoji').value = '';
        frame.querySelector('.frame-emoji-id').value = '';
    }
}

async function testAnimation() {
    const frames = collectFrames();
    
    if (frames.length === 0) {
        showNotification('❌ Please add at least one frame', 'error');
        return;
    }
    
    showNotification('🧪 Testing animation... (3 frames)', 'info');
    
    for (let i = 0; i < Math.min(3, frames.length); i++) {
        const frame = frames[i];
        let text = frame.text;
        
        if (frame.isEval && frame.evalCode) {
            try {
                text = eval(frame.evalCode);
            } catch (err) {
                console.error('Eval error:', err);
            }
        }
        
        console.log(`Test Frame ${i + 1}:`, text, frame.emoji);
        
        if (i < Math.min(3, frames.length) - 1) {
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
    
    showNotification('✅ Test complete! Check console for output', 'success');
}

function collectFrames() {
    const frames = [];
    const frameItems = document.querySelectorAll('.frame-item');
    
    frameItems.forEach(frame => {
        const text = frame.querySelector('.frame-text').value.trim();
        const emoji = frame.querySelector('.frame-emoji').value.trim();
        const emojiId = frame.querySelector('.frame-emoji-id').value.trim();
        const isEval = frame.querySelector('.frame-eval').checked;
        const evalCode = frame.querySelector('.frame-eval-code').value.trim();
        
        if (text) {
            frames.push({
                text: text,
                emoji: emoji || null,
                emojiId: emojiId || null,
                isEval: isEval,
                evalCode: isEval && evalCode ? evalCode : null
            });
        }
    });
    
    return frames;
}

async function saveAnimation() {
    const name = document.getElementById('animationName').value.trim();
    const interval = parseInt(document.getElementById('animationInterval').value);
    
    if (!name) {
        showNotification('❌ Please enter animation name', 'error');
        return;
    }
    
    if (interval < 2900) {
        showNotification('❌ Minimum interval is 2900ms', 'error');
        return;
    }
    
    const frames = collectFrames();
    
    if (frames.length === 0) {
        showNotification('❌ Please add at least one frame with text', 'error');
        return;
    }
    
    const animationData = {
        name: name,
        interval: interval,
        frames: frames
    };
    
    try {
        const id = document.getElementById('animationId').value;
        const url = id ? `${API_URL}/animations/${id}` : `${API_URL}/animations`;
        const method = id ? 'PUT' : 'POST';
        
        showNotification('💾 Saving...', 'info');
        
        const response = await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(animationData)
        });
        
        if (response.ok) {
            showNotification('✅ Animation saved successfully!', 'success');
            hideEditor();
            loadAnimations();
            loadExportAnimations();
            loadShareAnimations();
        } else {
            const error = await response.json();
            showNotification('❌ Failed: ' + error.error, 'error');
        }
    } catch (error) {
        console.error('Save animation error:', error);
        showNotification('❌ Failed to save animation', 'error');
    }
}

// ==================== EMOJI PICKER ====================

async function openEmojiPicker(frameId) {
    currentEmojiInputId = frameId;
    
    try {
        showNotification('Loading emojis...', 'info');
        const response = await fetch(`${API_URL}/emojis`);
        const emojis = await response.json();
        
        const grid = document.getElementById('emojiGrid');
        
        if (emojis.length === 0) {
            grid.innerHTML = '<p style="text-align: center; color: #666;">No custom emojis found</p>';
        } else {
            grid.innerHTML = emojis.map(emoji => `
                <div class="emoji-item" onclick="selectEmoji('${escapeHtml(emoji.name)}', '${emoji.id}', ${emoji.animated})" title="${escapeHtml(emoji.name)}">
                    <img src="${emoji.url}" alt="${escapeHtml(emoji.name)}" loading="lazy">
                    <div style="font-size: 10px; margin-top: 5px; overflow: hidden; text-overflow: ellipsis;">${escapeHtml(emoji.name)}</div>
                </div>
            `).join('');
        }
        
        document.getElementById('emojiSearch').value = '';
        document.getElementById('emojiPicker').style.display = 'flex';
    } catch (error) {
        console.error('Load emojis error:', error);
        showNotification('❌ Failed to load emojis', 'error');
    }
}

function selectEmoji(name, id, animated) {
    const frame = document.querySelector(`[data-frame-id="${currentEmojiInputId}"]`);
    if (frame) {
        const emojiInput = frame.querySelector('.frame-emoji');
        const emojiIdInput = frame.querySelector('.frame-emoji-id');
        
        emojiInput.value = animated ? `<a:${name}:${id}>` : `<:${name}:${id}>`;
        emojiIdInput.value = id;
    }
    
    document.getElementById('emojiPicker').style.display = 'none';
    showNotification(`✅ Selected: ${name}`, 'success');
}

function filterEmojis() {
    const search = document.getElementById('emojiSearch').value.toLowerCase();
    const items = document.querySelectorAll('.emoji-item');
    
    items.forEach(item => {
        const text = item.textContent.toLowerCase();
        item.style.display = text.includes(search) ? 'block' : 'none';
    });
}

// ==================== EXPORT/IMPORT ====================

async function loadExportAnimations() {
    try {
        const response = await fetch(`${API_URL}/animations`);
        const animations = await response.json();
        
        const select = document.getElementById('exportAnimationSelect');
        select.innerHTML = '<option value="">-- Select Animation --</option>';
        
        animations.forEach(anim => {
            const option = document.createElement('option');
            option.value = anim._id;
            option.textContent = `${anim.name} (${anim.frames.length} frames)`;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Load export animations error:', error);
    }
}

async function loadShareAnimations() {
    try {
        const response = await fetch(`${API_URL}/animations`);
        const animations = await response.json();
        
        const select = document.getElementById('shareAnimationSelect');
        select.innerHTML = '<option value="">-- Select Animation --</option>';
        
        animations.forEach(anim => {
            const option = document.createElement('option');
            option.value = anim._id;
            option.textContent = anim.name;
            select.appendChild(option);
        });
    } catch (error) {
        console.error('Load share animations error:', error);
    }
}

async function exportAnimation() {
    const animationId = document.getElementById('exportAnimationSelect').value;
    
    if (!animationId) {
        showNotification('❌ Please select an animation to export', 'error');
        return;
    }
    
    try {
        showNotification('📦 Exporting animation...', 'info');
        
        const response = await fetch(`${API_URL}/export/${animationId}`);
        const data = await response.json();
        
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${data.name.replace(/[^a-z0-9]/gi, '_')}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification('✅ Animation exported successfully!', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showNotification('❌ Failed to export animation', 'error');
    }
}

async function importAnimation(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
        showNotification('📥 Importing animation...', 'info');
        
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (!data.name || !data.frames || !Array.isArray(data.frames)) {
            throw new Error('Invalid animation file format');
        }
        
        const response = await fetch(`${API_URL}/import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(`✅ Imported: ${result.animation.name}`, 'success');
            loadAnimations();
            loadExportAnimations();
            loadShareAnimations();
            
            const status = document.getElementById('importStatus');
            status.className = 'success';
            status.textContent = `Successfully imported "${result.animation.name}" with ${result.animation.frames.length} frames`;
        } else {
            throw new Error(result.error || 'Import failed');
        }
    } catch (error) {
        console.error('Import error:', error);
        showNotification('❌ ' + error.message, 'error');
        
        const status = document.getElementById('importStatus');
        status.className = 'error';
        status.textContent = 'Import failed: ' + error.message;
    }
    
    e.target.value = '';
}

async function exportAllAnimations() {
    try {
        showNotification('📦 Exporting all animations...', 'info');
        
        const response = await fetch(`${API_URL}/animations`);
        const animations = await response.json();
        
        if (animations.length === 0) {
            showNotification('❌ No animations to export', 'error');
            return;
        }
        
        const exportData = {
            exportDate: new Date().toISOString(),
            version: '2.0.0',
            totalAnimations: animations.length,
            animations: animations.map(anim => ({
                name: anim.name,
                frames: anim.frames,
                interval: anim.interval
            }))
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `all_animations_${Date.now()}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        showNotification(`✅ Exported ${animations.length} animations!`, 'success');
    } catch (error) {
        console.error('Export all error:', error);
        showNotification('❌ Failed to export animations', 'error');
    }
}

async function importAllAnimations(e) {
    const file = e.target.files[0];
    if (!file) return;
    
    try {
        showNotification('📥 Importing all animations...', 'info');
        
        const text = await file.text();
        const data = JSON.parse(text);
        
        if (!data.animations || !Array.isArray(data.animations)) {
            throw new Error('Invalid bulk import file format');
        }
        
        let successCount = 0;
        let errorCount = 0;
        
        for (const anim of data.animations) {
            try {
                const response = await fetch(`${API_URL}/import`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(anim)
                });
                
                const result = await response.json();
                if (result.success) {
                    successCount++;
                } else {
                    errorCount++;
                }
            } catch (err) {
                errorCount++;
                console.error('Import error:', err);
            }
        }
        
        showNotification(`✅ Imported ${successCount} animations (${errorCount} failed)`, 'success');
        loadAnimations();
        loadExportAnimations();
        loadShareAnimations();
    } catch (error) {
        console.error('Import all error:', error);
        showNotification('❌ ' + error.message, 'error');
    }
    
    e.target.value = '';
}

async function copyToClipboard() {
    const animationId = document.getElementById('shareAnimationSelect').value;
    
    if (!animationId) {
        showNotification('❌ Please select an animation', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/export/${animationId}`);
        const data = await response.json();
        
        await navigator.clipboard.writeText(JSON.stringify(data, null, 2));
        showNotification('✅ Copied to clipboard!', 'success');
    } catch (error) {
        showNotification('❌ Failed to copy', 'error');
    }
}

async function pasteFromClipboard() {
    try {
        const text = await navigator.clipboard.readText();
        const data = JSON.parse(text);
        
        const response = await fetch(`${API_URL}/import`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            showNotification(`✅ Imported: ${result.animation.name}`, 'success');
            loadAnimations();
            loadExportAnimations();
            loadShareAnimations();
        }
    } catch (error) {
        showNotification('❌ Invalid clipboard data', 'error');
    }
}

// ==================== UTILITIES ====================

function showNotification(message, type = 'info') {
    let notification = document.getElementById('notification');
    
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 15px 25px;
            border-radius: 10px;
            color: white;
            font-weight: 600;
            z-index: 10000;
            animation: slideIn 0.3s ease-out;
            box-shadow: 0 5px 15px rgba(0,0,0,0.3);
        `;
        document.body.appendChild(notification);
    }
    
    const colors = {
        success: '#43b581',
        error: '#f04747',
        info: '#5865F2',
        warning: '#faa61a'
    };
    
    notification.style.background = colors[type] || colors.info;
    notification.textContent = message;
    notification.style.display = 'block';
    
    setTimeout(() => {
        notification.style.display = 'none';
    }, 3000);
}

function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}
// ==================== GLOW EFFECT MOUSE TRACKING ====================

const syncPointer = ({ x, y }) => {
    document.documentElement.style.setProperty('--x', x + 'px');
    document.documentElement.style.setProperty('--y', y + 'px');
};

document.body.addEventListener('pointermove', syncPointer);

// Apply glow effect to all cards
document.addEventListener('DOMContentLoaded', () => {
    // Apply data-glow attribute to cards
    const applyGlow = () => {
        document.querySelectorAll('.animation-card, .export-box, .import-box, .bulk-box, .share-box, .frame-item').forEach(el => {
            el.setAttribute('data-glow', '');
        });
    };
    
    // Apply on load
    applyGlow();
    
    // Reapply when animations list updates
    const originalLoadAnimations = window.loadAnimations;
    window.loadAnimations = function() {
        if (originalLoadAnimations) {
            originalLoadAnimations.call(this);
        }
        setTimeout(applyGlow, 100);
    };
    
    // Reapply when adding frames
    const originalAddFrame = window.addFrame;
    window.addFrame = function(...args) {
        if (originalAddFrame) {
            originalAddFrame.apply(this, args);
        }
        setTimeout(applyGlow, 100);
    };
});
