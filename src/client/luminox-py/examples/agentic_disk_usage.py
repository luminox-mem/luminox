from luminox import LuminoxClient
from luminox.agent.disk import DISK_TOOLS

if __name__ == "__main__":
    client = LuminoxClient(
        api_key="sk-ac-your-root-api-bearer-token",
        base_url="http://localhost:8029/api/v1",
    )
    print(client.ping())
    disk = client.disks.create()
    ctx = DISK_TOOLS.format_context(client, disk.id)
    r = DISK_TOOLS.execute_tool(
        ctx, "read_file", {"filename": "test.txt", "file_path": "/try/"}
    )
    print(r)
    r = DISK_TOOLS.execute_tool(ctx, "list_artifacts", {"file_path": "/"})
    print(r)

    r = DISK_TOOLS.execute_tool(
        ctx,
        "replace_string",
        {
            "filename": "test.txt",
            "file_path": "/try/",
            "old_string": "Hello",
            "new_string": "Hi",
        },
    )
    print(r)
    r = DISK_TOOLS.execute_tool(
        ctx, "read_file", {"filename": "test.txt", "file_path": "/try/"}
    )
    print(r)
    r = DISK_TOOLS.execute_tool(
        ctx,
        "download_file",
        {"filename": "test.txt", "file_path": "/try/", "expire": 300},
    )
    print(r)
