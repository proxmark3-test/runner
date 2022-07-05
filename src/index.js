const Docker = require("dockerode");

const image = require("./image");

const builder = {
	_docker: undefined,

	_init: () => {
		builder._docker = new Docker();
	},

	_prepareEnvironment: [
		(docker) => {
			console.log("Building image...");
			return image(docker).buildImage().then(output => {
				output.filter(out => out.stream || out.errorDetail).forEach(out => {
					if(out.errorDetail) {
						console.error(out.error.trim());

						process.exit(out.errorDetail.code);
					}

					console.log(out.stream.trim());
				});
			});
		}
	],

	prepareEnvironment: () => {
		console.log("Preparing environment...");

		return builder._prepareEnvironment.reduce((prev, cur) => prev.then(() => cur(builder._docker)), Promise.resolve()).then(() => {
			console.log("Prepared environment... Ready to accept commands...");
		});
	}
};

builder._init();

module.exports = builder;

builder.prepareEnvironment();
