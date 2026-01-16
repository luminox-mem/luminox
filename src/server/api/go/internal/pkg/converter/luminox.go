package converter

import (
	"github.com/memodb-io/Luminox/internal/modules/model"
	"github.com/memodb-io/Luminox/internal/modules/service"
)

// LuminoxConverter converts internal messages to Luminox format
type LuminoxConverter struct{}

// LuminoxMessage represents the API response format for Luminox.
// This is a Data Transfer Object (DTO) that converts UUID fields to strings
// while keeping the rest of the structure aligned with model.Message.
type LuminoxMessage struct {
	ID                       string         `json:"id"`
	SessionID                string         `json:"session_id"`
	ParentID                 *string        `json:"parent_id"` // Nullable for message threading
	Role                     string         `json:"role"`
	Parts                    []model.Part   `json:"parts"`
	SessionTaskProcessStatus string         `json:"session_task_process_status"` // Task processing state
	Meta                     map[string]any `json:"meta,omitempty"`
	TaskID                   *string        `json:"task_id"`
	CreatedAt                string         `json:"created_at"` // ISO 8601 timestamp for UI compatibility
	UpdatedAt                string         `json:"updated_at"` // ISO 8601 timestamp
}

// Convert converts internal model.Message to Luminox format
func (c *LuminoxConverter) Convert(messages []model.Message, publicURLs map[string]service.PublicURL) (interface{}, error) {
	result := make([]LuminoxMessage, len(messages))

	for i, msg := range messages {
		luminoxMsg := LuminoxMessage{
			ID:                       msg.ID.String(),
			SessionID:                msg.SessionID.String(),
			Role:                     msg.Role,
			Parts:                    msg.Parts,
			SessionTaskProcessStatus: msg.SessionTaskProcessStatus,
			CreatedAt:                msg.CreatedAt.Format("2006-01-02T15:04:05.999999Z07:00"), // ISO 8601 / RFC3339
			UpdatedAt:                msg.UpdatedAt.Format("2006-01-02T15:04:05.999999Z07:00"),
		}

		// Convert ParentID if present
		if msg.ParentID != nil {
			parentIDStr := msg.ParentID.String()
			luminoxMsg.ParentID = &parentIDStr
		}

		if msg.TaskID != nil {
			taskIDStr := msg.TaskID.String()
			luminoxMsg.TaskID = &taskIDStr
		}

		// Convert meta if present - handle datatypes.JSONType
		if metaData := msg.Meta.Data(); len(metaData) > 0 {
			luminoxMsg.Meta = metaData
		}

		result[i] = luminoxMsg
	}

	return result, nil
}
