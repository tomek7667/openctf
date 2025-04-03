package utils_test

import (
	"fmt"
	"os"
	"testing"

	"openctfbackend/internal/logger"
	"openctfbackend/internal/utils"
)

func TestMain(m *testing.M) {
	logger.SetLogLevel()

	code := m.Run()

	os.Exit(code)
}

func TestBatchify(t *testing.T) {
	testcases := map[string]struct {
		threads  int
		array    []int
		consumer func(batch []int, batchNumber int)
	}{
		"batchify for 1 thread should work the same as no batchify made": {
			threads: 1,
			array: []int{
				1, 2, 3, 4, 5,
			},
			consumer: func(batch []int, batchNumber int) {
				if len(batch) != 5 {
					panic(
						fmt.Errorf(
							"the size of the batch should be 5, all elements processed on 1 thread, so in one consumer. Met %d",
							len(batch),
						),
					)
				}

				if batchNumber != 0 {
					panic(
						"only one batch should have been consumed",
					)
				}
			},
		},
		"batchify for 4 threads should make 4 batches for 10, where the first three have 3 elements and the last one has 1": {
			threads: 4,
			array: []int{
				0, 0, 0,
				1, 1, 1,
				2, 2, 2,
				3,
			},
			consumer: func(batch []int, batchNumber int) {
				if batchNumber == 0 || batchNumber == 1 || batchNumber == 2 {
					if len(batch) != 3 {
						panic(
							fmt.Errorf(
								"the batch %d should have 3 elements; met %d",
								batchNumber,
								len(batch),
							),
						)
					}
				}
				if batchNumber == 3 {
					if len(batch) != 1 {
						panic(
							fmt.Errorf(
								"the batch %d should have 1 element; met %d",
								batchNumber,
								len(batch),
							),
						)
					}
				}
				if batchNumber > 3 || batchNumber < 0 {
					panic(
						fmt.Errorf(
							"there shouldn't be more than 4 batches, met %d",
							batchNumber,
						),
					)
				}
			},
		},
	}
	for testname, tc := range testcases {
		t.Run(testname, func(t *testing.T) {
			utils.Batchify(tc.array, tc.threads, tc.consumer)
		})
	}
}

func TestSplitMessage(t *testing.T) {
	testcases := map[string]struct {
		message      string
		chunkSize    int
		outputLength int
		firstBit     string
		lastBit      string
	}{
		"correct number of chunks out": {
			message:      "aaaabbbbccccddddeee",
			chunkSize:    4,
			outputLength: 5,
			firstBit:     "aaaa",
			lastBit:      "eee",
		},
	}
	for testname, tc := range testcases {
		t.Run(testname, func(t *testing.T) {
			output := utils.SplitMessage(tc.message, tc.chunkSize)
			if len(output) != tc.outputLength {
				t.Errorf(
					"expected output length differ, expected %d, got %d",
					tc.outputLength,
					len(output),
				)
			}
			if output[0] != tc.firstBit {
				t.Errorf(
					"expected first bit differ, expected %s, got %s",
					tc.firstBit,
					output[0],
				)
			}
			if output[tc.outputLength-1] != tc.lastBit {
				t.Errorf(
					"expected last bit differ, expected %s, got %s",
					tc.lastBit,
					output[tc.outputLength-1],
				)
			}
		})
	}
}
