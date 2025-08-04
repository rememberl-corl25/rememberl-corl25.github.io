/**
 * Calendar functionality for the workshop schedule
 */
document.addEventListener('DOMContentLoaded', function() {
    // Get all "Add to Calendar" buttons
    const calendarButtons = document.querySelectorAll('.add-to-calendar');
    
    // Add click event listener to each button
    calendarButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent event bubbling
            
            // Get event details from the button's parent element
            const scheduleItem = this.closest('.schedule-activity');
            const timeElement = scheduleItem.previousElementSibling;
            const dateString = "September 27, 2025"; // Workshop date
            
            // Get the time from the time element
            const timeText = timeElement.textContent.trim();
            
            // Get event title - use category text + speaker name if available
            const category = scheduleItem.querySelector('.schedule-category').textContent.trim();
            const speakerElement = scheduleItem.querySelector('.speaker-name');
            const speakerName = speakerElement ? speakerElement.textContent.trim() : '';
            
            // Get the description - all text content after the category/speaker
            let description = scheduleItem.textContent
                .replace(category, '')
                .replace(speakerName, '')
                .replace('Add to Calendar', '')
                .trim();
            
            // Create event title
            let eventTitle = 'RemembeRL Workshop: ' + category;
            if (speakerName) {
                eventTitle += ' - ' + speakerName;
            }
            
            // Parse time to create start and end times
            let startTime, endTime;
            if (timeText.includes('-')) {
                // Time range (e.g., "9:45 - 10:30 AM")
                const [start, end] = timeText.split('-').map(t => t.trim());
                startTime = parseTimeString(start, dateString);
                endTime = parseTimeString(end, dateString);
            } else {
                // Single time (e.g., "9:30 AM")
                startTime = parseTimeString(timeText, dateString);
                // Default duration: 15 minutes
                endTime = new Date(startTime.getTime() + 15 * 60000);
            }
            
            // Create Google Calendar URL
            const calendarUrl = createGoogleCalendarUrl(
                eventTitle,
                description,
                'COEX Convention & Exhibition Center, Seoul, South Korea',
                startTime,
                endTime
            );
            
            // Open calendar URL in new tab
            window.open(calendarUrl, '_blank');
        });
    });
    
    /**
     * Parse a time string and convert it to a Date object
     * @param {string} timeStr - Time string (e.g., "9:30 AM")
     * @param {string} dateStr - Date string (e.g., "September 27, 2025")
     * @returns {Date} Date object representing the time
     */
    function parseTimeString(timeStr, dateStr) {
        // Handle "AM/PM" format
        let time = timeStr;
        let isPM = false;
        
        if (timeStr.includes('PM')) {
            isPM = true;
            time = timeStr.replace('PM', '').trim();
        } else if (timeStr.includes('AM')) {
            time = timeStr.replace('AM', '').trim();
        }
        
        // Extract hours and minutes
        let [hours, minutes] = [12, 0]; // Default values
        
        if (time.includes(':')) {
            [hours, minutes] = time.split(':').map(Number);
        } else {
            hours = parseInt(time);
        }
        
        // Adjust hours for PM
        if (isPM && hours < 12) {
            hours += 12;
        }
        // Adjust for 12 AM
        if (!isPM && hours === 12) {
            hours = 0;
        }
        
        // Create date object
        const date = new Date(dateStr);
        date.setHours(hours, minutes, 0, 0);
        
        return date;
    }
    
    /**
     * Create Google Calendar URL
     * @param {string} title - Event title
     * @param {string} description - Event description
     * @param {string} location - Event location
     * @param {Date} start - Start time
     * @param {Date} end - End time
     * @returns {string} Google Calendar URL
     */
    function createGoogleCalendarUrl(title, description, location, start, end) {
        const baseUrl = 'https://calendar.google.com/calendar/render';
        const params = new URLSearchParams({
            action: 'TEMPLATE',
            text: title,
            details: description,
            location: location,
            dates: formatDateForGoogleCalendar(start) + '/' + formatDateForGoogleCalendar(end)
        });
        
        return baseUrl + '?' + params.toString();
    }
    
    /**
     * Format date for Google Calendar URL
     * @param {Date} date - Date object
     * @returns {string} Formatted date string (YYYYMMDDTHHMMSSZ)
     */
    function formatDateForGoogleCalendar(date) {
        return date.toISOString().replace(/-|:|\.\d+/g, '');
    }
}); 