import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TimelineEvent } from '@/types';
import { formatDate, getEventBadgeColor, getEventDotColor, getEventIcon } from '@/lib/helpers';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface InteractiveTimelineProps {
  events: TimelineEvent[];
}

const InteractiveTimeline: React.FC<InteractiveTimelineProps> = ({ events }) => {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [isMobileView, setIsMobileView] = useState(false);
  
  // Setup responsive detection
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobileView(window.innerWidth < 768);
    };

    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Clean up
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);
  
  // Sort events by date (most recent first)
  const sortedEvents = [...events].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  // Strip HTML tags from text
  const stripHtmlTags = (html: string) => {
    // Create a temporary div element
    const tempDiv = document.createElement('div');
    // Set the HTML content
    tempDiv.innerHTML = html;
    // Return the text content
    return tempDiv.textContent || tempDiv.innerText || '';
  };

  // Determine if description is long enough to need the "read more" button
  // More strict limit for mobile, more lenient for desktop
  const isDescriptionLong = (desc: string) => {
    if (!desc) return false;
    
    // Strip HTML tags for length calculation
    const plainText = stripHtmlTags(desc);
    
    return isMobileView 
      ? plainText.length > 120  // Lower threshold for mobile
      : plainText.length > 300; // Higher threshold for desktop
  };
  
  // Truncated description
  const getTruncatedDescription = (desc: string) => {
    if (!desc) return '';
    
    // Strip HTML tags for preview
    const plainText = stripHtmlTags(desc);
    
    if (!isDescriptionLong(desc)) return plainText;
    
    const limit = isMobileView ? 117 : 297;
    return `${plainText.substring(0, limit)}...`;
  };

  return (
    <div className="space-y-6">
      
      {/* Timeline Visualization - Different layout for mobile and desktop */}
      <div className={`relative ${!isMobileView ? "pl-8" : ""}`}>
        {/* Desktop timeline line */}
        {!isMobileView && (
          <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 z-0"></div>
        )}
        
        {sortedEvents.map((event, index) => (
          <motion.div 
            key={event.id} 
            className={`timeline-item relative mb-6 last:mb-0 ${!isMobileView ? "pl-16" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            {/* Desktop version of timeline dot (outside card) */}
            {!isMobileView && (
              <div 
                className={`timeline-dot absolute left-0 w-10 h-10 ${getEventDotColor(event.eventType)} 
                  flex items-center justify-center text-white z-10 transition-all duration-300
                  hover:scale-110 hover:rotate-12 transform`}
                style={{clipPath: "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)"}}
              >
                <i className={`fas ${getEventIcon(event.eventType, event.icon)}`}></i>
              </div>
            )}
            
            <div className="bg-white rounded-lg shadow-sm relative transition-all duration-300 
                transform hover:-translate-y-1 hover:shadow-md border border-gray-100 overflow-hidden">
              
              {/* Mobile version - integrated icon in the card header */}
              {isMobileView && (
                <div className="flex items-center gap-3 p-3 border-b border-gray-100">
                  <div 
                    className={`w-10 h-10 ${getEventDotColor(event.eventType)} 
                      flex items-center justify-center text-white rounded-full`}
                  >
                    <i className={`fas ${getEventIcon(event.eventType, event.icon)}`}></i>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-500 font-medium">{formatDate(event.date)}</span>
                      <span className={`${getEventBadgeColor(event.eventType)} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                        {event.eventType}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              
              {/* Card content */}
              <div className="p-4">
                {/* Desktop version header */}
                {!isMobileView && (
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-sm text-gray-500 font-medium">{formatDate(event.date)}</span>
                    <span className={`${getEventBadgeColor(event.eventType)} text-xs font-medium px-2.5 py-0.5 rounded-full`}>
                      {event.eventType}
                    </span>
                  </div>
                )}
                
                <h3 className="font-bold text-lg mb-2">
                  {event.title}
                </h3>
                
                {/* Description with read more functionality on both mobile and desktop for long text */}
                <div className="text-gray-600 w-full break-words">
                  {isDescriptionLong(event.description) ? (
                    <div className="flex flex-col">
                      <p>{getTruncatedDescription(event.description)}</p>
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="mt-1 p-0 h-auto text-sm text-primary hover:text-primary/80 font-medium self-start"
                        onClick={() => setSelectedEvent(event)}
                      >
                        Read more
                      </Button>
                    </div>
                  ) : (
                    <div
                      className="text-gray-600 rich-text-content"
                      dangerouslySetInnerHTML={{ __html: event.description }}
                    />
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      {sortedEvents.length === 0 && (
        <div className="text-center py-10 text-gray-500">
          No timeline events found for this country.
        </div>
      )}

      {/* Modal for reading full text (for both mobile and desktop) */}
      <Dialog open={!!selectedEvent} onOpenChange={(open) => !open && setSelectedEvent(null)}>
        <DialogContent className="sm:max-w-[600px] md:max-w-[700px] max-h-[80vh] overflow-hidden flex flex-col">
          <div className="absolute right-4 top-4">
            <DialogClose className="rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-6 w-6" />
              <span className="sr-only">Close</span>
            </DialogClose>
          </div>
          <DialogHeader className="flex-shrink-0 pt-2">
            <DialogTitle className="pr-8 text-xl font-bold">{selectedEvent?.title}</DialogTitle>
          </DialogHeader>
          <div className="space-y-3 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div 
                className={`w-8 h-8 ${getEventDotColor(selectedEvent?.eventType || '')} 
                  flex items-center justify-center text-white rounded-full`}
              >
                <i className={`fas ${getEventIcon(selectedEvent?.eventType || '', selectedEvent?.icon || null)}`}></i>
              </div>
              <div>
                <span className="text-gray-500 text-sm">{selectedEvent?.date ? formatDate(selectedEvent.date) : ''}</span>
                <span className={`ml-2 ${getEventBadgeColor(selectedEvent?.eventType || '')} text-xs font-medium px-2 py-0.5 rounded-full`}>
                  {selectedEvent?.eventType}
                </span>
              </div>
            </div>
          </div>
          {/* Scrollable content area */}
          <div className="overflow-y-auto pr-2 my-4 flex-grow">
            <div 
              className="text-gray-700 text-base leading-relaxed px-1 rich-text-content"
              dangerouslySetInnerHTML={{ __html: selectedEvent?.description || '' }}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default InteractiveTimeline;