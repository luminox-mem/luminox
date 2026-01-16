package normalizer

import (
	"encoding/json"
	"fmt"

	"github.com/memodb-io/Luminox/internal/modules/service"
)

// LuminoxNormalizer normalizes Luminox (internal) format
type LuminoxNormalizer struct{}

// NormalizeFromLuminoxMessage converts Luminox format to internal format
// This is essentially a validation step since Luminox IS the internal format
// Returns: role, parts, messageMeta, error
func (n *LuminoxNormalizer) NormalizeFromLuminoxMessage(messageJSON json.RawMessage) (string, []service.PartIn, map[string]interface{}, error) {
	var msg struct {
		Role  string                 `json:"role"`
		Parts []service.PartIn       `json:"parts"`
		Meta  map[string]interface{} `json:"meta,omitempty"` // Optional message-level metadata
	}

	if err := json.Unmarshal(messageJSON, &msg); err != nil {
		return "", nil, nil, fmt.Errorf("failed to unmarshal Luminox message: %w", err)
	}

	// Validate role
	validRoles := map[string]bool{"user": true, "assistant": true}
	if !validRoles[msg.Role] {
		return "", nil, nil, fmt.Errorf("invalid role: %s (must be one of: user, assistant)", msg.Role)
	}

	// Validate each part
	for i, part := range msg.Parts {
		if err := part.Validate(); err != nil {
			return "", nil, nil, fmt.Errorf("invalid part at index %d: %w", i, err)
		}
	}

	// Extract or create message-level metadata
	messageMeta := msg.Meta
	if messageMeta == nil {
		messageMeta = make(map[string]interface{})
	}

	// Ensure source_format is set
	if _, hasSourceFormat := messageMeta["source_format"]; !hasSourceFormat {
		messageMeta["source_format"] = "luminox"
	}

	return msg.Role, msg.Parts, messageMeta, nil
}
