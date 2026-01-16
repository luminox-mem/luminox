package converter

import (
	"testing"
	"time"

	"github.com/google/uuid"
	"github.com/memodb-io/Luminox/internal/modules/model"
	"github.com/memodb-io/Luminox/internal/modules/service"
	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
	"gorm.io/datatypes"
)

func TestLuminoxConverter_Convert_TextMessage(t *testing.T) {
	converter := &LuminoxConverter{}

	messages := []model.Message{
		createTestMessage("user", []model.Part{
			{Type: "text", Text: "Hello, world!"},
		}, nil),
	}

	result, err := converter.Convert(messages, nil)
	require.NoError(t, err)

	luminoxMessages, ok := result.([]LuminoxMessage)
	require.True(t, ok)
	require.Len(t, luminoxMessages, 1)

	msg := luminoxMessages[0]
	assert.Equal(t, "user", msg.Role)
	assert.Len(t, msg.Parts, 1)
	assert.Equal(t, "text", msg.Parts[0].Type)
	assert.Equal(t, "Hello, world!", msg.Parts[0].Text)
}

func TestLuminoxConverter_Convert_WithAsset(t *testing.T) {
	converter := &LuminoxConverter{}

	messages := []model.Message{
		createTestMessage("user", []model.Part{
			{
				Type:     "image",
				Filename: "test.jpg",
				Asset: &model.Asset{
					S3Key: "assets/test.jpg",
					MIME:  "image/jpeg",
					SizeB: 1024,
				},
			},
		}, nil),
	}

	publicURLs := map[string]service.PublicURL{
		"assets/test.jpg": {URL: "https://example.com/test.jpg"},
	}

	result, err := converter.Convert(messages, publicURLs)
	require.NoError(t, err)

	luminoxMessages := result.([]LuminoxMessage)
	msg := luminoxMessages[0]

	assert.Len(t, msg.Parts, 1)
	part := msg.Parts[0]
	assert.Equal(t, "image", part.Type)
	assert.NotNil(t, part.Asset)
	assert.Equal(t, "assets/test.jpg", part.Asset.S3Key)
	assert.Equal(t, "test.jpg", part.Filename)     // Filename is in Part, not Asset
	assert.Equal(t, "image/jpeg", part.Asset.MIME) // MIME instead of ContentType
	assert.Equal(t, int64(1024), part.Asset.SizeB) // SizeB instead of Size
}

func TestLuminoxConverter_Convert_WithCacheControl(t *testing.T) {
	converter := &LuminoxConverter{}

	messages := []model.Message{
		createTestMessage("user", []model.Part{
			{
				Type: "text",
				Text: "Cached content",
				Meta: map[string]any{
					"cache_control": map[string]interface{}{
						"type": "ephemeral",
					},
				},
			},
		}, nil),
	}

	result, err := converter.Convert(messages, nil)
	require.NoError(t, err)

	luminoxMessages := result.([]LuminoxMessage)
	msg := luminoxMessages[0]

	assert.Len(t, msg.Parts, 1)
	part := msg.Parts[0]
	assert.NotNil(t, part.Meta)
	assert.NotNil(t, part.Meta["cache_control"])

	cacheControl := part.Meta["cache_control"].(map[string]any)
	assert.Equal(t, "ephemeral", cacheControl["type"])
}

func TestLuminoxConverter_Convert_MessageMeta(t *testing.T) {
	converter := &LuminoxConverter{}

	messages := []model.Message{
		createTestMessage("user", []model.Part{
			{Type: "text", Text: "Test"},
		}, map[string]any{
			"custom_field": "custom_value",
		}),
	}

	result, err := converter.Convert(messages, nil)
	require.NoError(t, err)

	luminoxMessages := result.([]LuminoxMessage)
	msg := luminoxMessages[0]

	assert.NotNil(t, msg.Meta)
	assert.Equal(t, "custom_value", msg.Meta["custom_field"])
}

func TestLuminoxConverter_Convert_MultipleParts(t *testing.T) {
	converter := &LuminoxConverter{}

	messages := []model.Message{
		createTestMessage("user", []model.Part{
			{Type: "text", Text: "First part"},
			{Type: "text", Text: "Second part"},
			{
				Type:     "image",
				Filename: "image.jpg",
				Asset: &model.Asset{
					S3Key: "assets/image.jpg",
					MIME:  "image/jpeg",
					SizeB: 2048,
				},
			},
		}, nil),
	}

	result, err := converter.Convert(messages, nil)
	require.NoError(t, err)

	luminoxMessages := result.([]LuminoxMessage)
	msg := luminoxMessages[0]

	assert.Len(t, msg.Parts, 3)
	assert.Equal(t, "text", msg.Parts[0].Type)
	assert.Equal(t, "First part", msg.Parts[0].Text)
	assert.Equal(t, "text", msg.Parts[1].Type)
	assert.Equal(t, "Second part", msg.Parts[1].Text)
	assert.Equal(t, "image", msg.Parts[2].Type)
	assert.NotNil(t, msg.Parts[2].Asset)
}

func TestLuminoxConverter_Convert_EmptyMeta(t *testing.T) {
	converter := &LuminoxConverter{}

	// Test with nil meta
	messages := []model.Message{
		createTestMessage("user", []model.Part{
			{Type: "text", Text: "Test", Meta: nil},
		}, nil),
	}

	result, err := converter.Convert(messages, nil)
	require.NoError(t, err)

	luminoxMessages := result.([]LuminoxMessage)
	msg := luminoxMessages[0]
	part := msg.Parts[0]

	// Meta should be nil or empty
	if part.Meta != nil {
		assert.Empty(t, part.Meta)
	}
}

func TestLuminoxConverter_Convert_MultipleMessages(t *testing.T) {
	converter := &LuminoxConverter{}

	messages := []model.Message{
		createTestMessage("user", []model.Part{
			{Type: "text", Text: "First message"},
		}, nil),
		createTestMessage("assistant", []model.Part{
			{Type: "text", Text: "Second message"},
		}, nil),
		createTestMessage("user", []model.Part{
			{Type: "text", Text: "Third message"},
		}, nil),
	}

	result, err := converter.Convert(messages, nil)
	require.NoError(t, err)

	luminoxMessages := result.([]LuminoxMessage)
	assert.Len(t, luminoxMessages, 3)
	assert.Equal(t, "user", luminoxMessages[0].Role)
	assert.Equal(t, "assistant", luminoxMessages[1].Role)
	assert.Equal(t, "user", luminoxMessages[2].Role)
}

func TestLuminoxConverter_Convert_Timestamps(t *testing.T) {
	converter := &LuminoxConverter{}

	// Create a message with specific timestamps
	now := time.Now()
	msg := model.Message{
		ID:        uuid.New(),
		SessionID: uuid.New(),
		Role:      "user",
		Parts: []model.Part{
			{Type: "text", Text: "Test message"},
		},
		CreatedAt: now,
		UpdatedAt: now.Add(5 * time.Minute), // Updated 5 minutes later
	}
	msg.Meta = datatypes.NewJSONType(map[string]any{})

	messages := []model.Message{msg}

	result, err := converter.Convert(messages, nil)
	require.NoError(t, err)

	luminoxMessages := result.([]LuminoxMessage)
	assert.Len(t, luminoxMessages, 1)

	converted := luminoxMessages[0]

	// Verify timestamps are converted to ISO 8601 strings
	expectedCreatedAt := now.Format("2006-01-02T15:04:05.999999Z07:00")
	expectedUpdatedAt := now.Add(5 * time.Minute).Format("2006-01-02T15:04:05.999999Z07:00")

	assert.Equal(t, expectedCreatedAt, converted.CreatedAt)
	assert.Equal(t, expectedUpdatedAt, converted.UpdatedAt)

	// Verify timestamps can be parsed back
	parsedCreatedAt, err := time.Parse(time.RFC3339Nano, converted.CreatedAt)
	require.NoError(t, err)
	parsedUpdatedAt, err := time.Parse(time.RFC3339Nano, converted.UpdatedAt)
	require.NoError(t, err)

	// Verify UpdatedAt is after CreatedAt
	assert.True(t, parsedUpdatedAt.After(parsedCreatedAt))
}

func TestLuminoxConverter_Convert_ParentID(t *testing.T) {
	converter := &LuminoxConverter{}

	parentID := uuid.New()
	msg := model.Message{
		ID:        uuid.New(),
		SessionID: uuid.New(),
		ParentID:  &parentID,
		Role:      "user",
		Parts: []model.Part{
			{Type: "text", Text: "Reply message"},
		},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	msg.Meta = datatypes.NewJSONType(map[string]any{})

	result, err := converter.Convert([]model.Message{msg}, nil)
	require.NoError(t, err)

	luminoxMessages := result.([]LuminoxMessage)
	assert.Len(t, luminoxMessages, 1)

	converted := luminoxMessages[0]

	// Verify ParentID is converted
	require.NotNil(t, converted.ParentID)
	assert.Equal(t, parentID.String(), *converted.ParentID)
}

func TestLuminoxConverter_Convert_NoParentID(t *testing.T) {
	converter := &LuminoxConverter{}

	msg := model.Message{
		ID:        uuid.New(),
		SessionID: uuid.New(),
		ParentID:  nil, // No parent
		Role:      "user",
		Parts: []model.Part{
			{Type: "text", Text: "Root message"},
		},
		CreatedAt: time.Now(),
		UpdatedAt: time.Now(),
	}
	msg.Meta = datatypes.NewJSONType(map[string]any{})

	result, err := converter.Convert([]model.Message{msg}, nil)
	require.NoError(t, err)

	luminoxMessages := result.([]LuminoxMessage)
	assert.Len(t, luminoxMessages, 1)

	converted := luminoxMessages[0]

	// Verify ParentID is nil
	assert.Nil(t, converted.ParentID)
}

func TestLuminoxConverter_Convert_SessionTaskProcessStatus(t *testing.T) {
	converter := &LuminoxConverter{}

	testCases := []struct {
		name   string
		status string
	}{
		{"pending status", "pending"},
		{"running status", "running"},
		{"success status", "success"},
		{"failed status", "failed"},
	}

	for _, tc := range testCases {
		t.Run(tc.name, func(t *testing.T) {
			msg := model.Message{
				ID:                       uuid.New(),
				SessionID:                uuid.New(),
				Role:                     "user",
				SessionTaskProcessStatus: tc.status,
				Parts: []model.Part{
					{Type: "text", Text: "Test message"},
				},
				CreatedAt: time.Now(),
				UpdatedAt: time.Now(),
			}
			msg.Meta = datatypes.NewJSONType(map[string]any{})

			result, err := converter.Convert([]model.Message{msg}, nil)
			require.NoError(t, err)

			luminoxMessages := result.([]LuminoxMessage)
			assert.Len(t, luminoxMessages, 1)

			converted := luminoxMessages[0]
			assert.Equal(t, tc.status, converted.SessionTaskProcessStatus)
		})
	}
}
