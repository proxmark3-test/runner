const os = require("os");
const path = require("path");

module.exports = (docker) => {
	const container = {
		reboot: (firmwarePath) => {
			return new Promise((resolve, reject) => {
				// TODO: Limit resources
				docker.run("proxmark3-runner", [
					"bash",
					"/env/reboot.sh"
				], process.stdout, {
					WorkingDir: "/",
					NetworkDisabled: true,
					Env: [
						`CPUS=${os.cpus().length}`
					],
					HostConfig: {
						Devices: [
							{
								PathOnHost: "/dev/ttyACM0",
								PathInContainer: "/dev/ttyACM0",
								CgroupPermissions: "rwm"
							}
						],
						Mounts: [
							{
								Target: "/tmp/pm3.tar",
								Type: "bind",
								Source: firmwarePath
							},
							{
								Target: "/env",
								Type: "bind",
								Source: path.join(__dirname, "../../environment"),
								ReadOnly: true
							}
						]
					}
				}, {}, function (err, data) {
					if(err) {
						return reject(err);
					}

					if(data.StatusCode != 0) {
						return reject(new Error(`Exit code is ${data.StatusCode}`));
					}

					resolve();
				});
			});
		},

		flash: (firmwarePath) => {
			return new Promise((resolve, reject) => {
				// TODO: Limit resources
				docker.run("proxmark3-runner", [
					"bash",
					"/env/flash.sh"
				], process.stdout, {
					WorkingDir: "/",
					NetworkDisabled: true,
					Env: [
						`CPUS=${os.cpus().length}`
					],
					HostConfig: {
						Devices: [
							{
								PathOnHost: "/dev/ttyACM0",
								PathInContainer: "/dev/ttyACM0",
								CgroupPermissions: "rwm"
							}
						],
						Mounts: [
							{
								Target: "/tmp/pm3.tar",
								Type: "bind",
								Source: firmwarePath
							},
							{
								Target: "/env",
								Type: "bind",
								Source: path.join(__dirname, "../../environment"),
								ReadOnly: true
							}
						]
					}
				}, {}, function (err, data) {
					if(err) {
						return reject(err);
					}

					if(data.StatusCode != 0) {
						return reject(new Error(`Exit code is ${data.StatusCode}`));
					}

					resolve();
				});
			});
		}
	};

	return container;
};
