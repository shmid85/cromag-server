run:
	docker run -itd --rm -p5000:5000 -p 5001:5001 --name cromag-server shmid85/cromag-server:beta2
stop:
	docker stop cromag-server